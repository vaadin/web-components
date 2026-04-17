package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("No Current Item")
@Route(value = "no-current", layout = MainLayout.class)
@Menu(title = "No Current Item", order = 7)
public class NoCurrentView extends VerticalLayout {

    public NoCurrentView() {
        add(new H2("Current Item vs No Current Item"));
        add(new Paragraph(
                "Demonstrates Requirement 9: comparing a breadcrumb that marks the "
                        + "current page with one that ends at the parent level only."));

        add(new H3("With current page marked"));
        Breadcrumb withCurrent = new Breadcrumb();
        withCurrent.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Settings", "/settings"),
                new BreadcrumbItem("Profile").asCurrent());
        withCurrent.addNavigateListener(event -> {
            Notification.show("With current - navigating to: " + event.getPath());
        });
        add(withCurrent);

        add(new H3("Without current page (ends at parent)"));
        Breadcrumb withoutCurrent = new Breadcrumb();
        withoutCurrent.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Settings", "/settings"));
        withoutCurrent.addNavigateListener(event -> {
            Notification.show("Without current - navigating to: " + event.getPath());
        });
        add(withoutCurrent);
    }
}
