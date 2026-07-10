package com.antiportfolio.backend;

import java.sql.Connection;
import java.util.List;
import javax.sql.DataSource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class SchemaMaintenance {
    private static final List<TextColumn> TEXT_COLUMNS = List.of(
        new TextColumn("hero_content", "bio"),
        new TextColumn("about_content", "bio"),
        new TextColumn("services", "description"),
        new TextColumn("projects", "description"),
        new TextColumn("experience", "description"),
        new TextColumn("testimonials", "quote"),
        new TextColumn("contact_messages", "message"),
        new TextColumn("site_settings", "analytics_script")
    );

    @Bean
    @Order(0)
    CommandLineRunner repairPostgresLobColumns(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        return args -> {
            if (!isPostgres(dataSource)) {
                return;
            }

            for (TextColumn column : TEXT_COLUMNS) {
                if (isOidColumn(jdbcTemplate, column)) {
                    convertOidColumnToText(jdbcTemplate, column);
                }
            }
        };
    }

    private boolean isPostgres(DataSource dataSource) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            return "PostgreSQL".equalsIgnoreCase(connection.getMetaData().getDatabaseProductName());
        }
    }

    private boolean isOidColumn(JdbcTemplate jdbcTemplate, TextColumn column) {
        List<String> types = jdbcTemplate.query(
            """
                select udt_name
                from information_schema.columns
                where table_schema = current_schema()
                  and table_name = ?
                  and column_name = ?
                """,
            (rs, rowNum) -> rs.getString("udt_name"),
            column.tableName(),
            column.columnName()
        );
        return types.stream().anyMatch("oid"::equalsIgnoreCase);
    }

    private void convertOidColumnToText(JdbcTemplate jdbcTemplate, TextColumn column) {
        String tableName = column.tableName();
        String columnName = column.columnName();
        String sql = """
            alter table %s
            alter column %s type text
            using case
                when %s is null then null
                else convert_from(lo_get(%s), 'UTF8')
            end
            """.formatted(tableName, columnName, columnName, columnName);

        try {
            jdbcTemplate.execute(sql);
        } catch (RuntimeException ex) {
            jdbcTemplate.execute("""
                alter table %s
                alter column %s type text
                using null
                """.formatted(tableName, columnName));
        }
    }

    private record TextColumn(String tableName, String columnName) {
    }
}
