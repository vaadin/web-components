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

@PageTitle("Non-Clickable Item")
@Route(value = "non-clickable", layout = MainLayout.class)
@Menu(title = "Non-Clickable Item", order = 6)
public class NonClickableView extends VerticalLayout {

    public NonClickableView() {
        add(new H2("Non-Clickable Breadcrumb Item"));
        add(new Paragraph(
                "Demonstrates Requirement 8: an intermediate breadcrumb item with no "
                        + "path renders as plain text (not a link). Here, 'Billing' is a "
                        + "category label that is not navigable."));

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("Organization", "/org"),
                new BreadcrumbItem("Billing"),
                new BreadcrumbItem("Invoice #4521").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        add(breadcrumb);
    }
}
