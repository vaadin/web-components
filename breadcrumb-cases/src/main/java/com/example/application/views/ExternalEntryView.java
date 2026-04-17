package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("External Entry")
@Route(value = "external-entry", layout = MainLayout.class)
@Menu(title = "External Entry", order = 2)
public class ExternalEntryView extends VerticalLayout {

    public ExternalEntryView() {
        add(new H2("External Entry Point"));
        add(new Paragraph(
                "Demonstrates Use Case 2: a user arriving at a deep page from an external "
                        + "search result. The breadcrumb orients them within the site hierarchy, "
                        + "showing the full path even though they did not navigate through each level."));

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Documentation", "/docs"),
                new BreadcrumbItem("API Reference", "/docs/api"),
                new BreadcrumbItem("REST Endpoints", "/docs/api/rest"),
                new BreadcrumbItem("GET /users").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        add(breadcrumb);
    }
}
