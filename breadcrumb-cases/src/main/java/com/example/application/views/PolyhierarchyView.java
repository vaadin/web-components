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

@PageTitle("Polyhierarchy")
@Route(value = "polyhierarchy", layout = MainLayout.class)
@Menu(title = "Polyhierarchy", order = 3)
public class PolyhierarchyView extends VerticalLayout {

    public PolyhierarchyView() {
        add(new H2("Polyhierarchy"));
        add(new Paragraph(
                "Demonstrates Requirement 5 (Use Case 3): the same product page can be "
                        + "reached via different navigation paths. Each breadcrumb reflects the "
                        + "path actually taken."));

        add(new H3("Path 1: Via category"));
        Breadcrumb path1 = new Breadcrumb();
        path1.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Electronics", "/electronics"),
                new BreadcrumbItem("Laptops", "/electronics/laptops"),
                new BreadcrumbItem("ThinkPad").asCurrent());
        path1.addNavigateListener(event -> {
            Notification.show("Path 1 navigating to: " + event.getPath());
        });
        add(path1);

        add(new H3("Path 2: Via deals"));
        Breadcrumb path2 = new Breadcrumb();
        path2.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("This Week's Deals", "/deals"),
                new BreadcrumbItem("ThinkPad").asCurrent());
        path2.addNavigateListener(event -> {
            Notification.show("Path 2 navigating to: " + event.getPath());
        });
        add(path2);
    }
}
