package com.notesmanager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration.
 * Provides API documentation at /swagger-ui.html and /v3/api-docs.
 * Configures API metadata including title, version, and contact information.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI notesManagerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Notes Manager API")
                        .description("RESTful API for the Notes Manager application. " +
                                "Provides CRUD operations for notes with search, filter, " +
                                "pin/archive functionality, and file attachment support.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Developer")
                                .email("dev@notesmanager.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}