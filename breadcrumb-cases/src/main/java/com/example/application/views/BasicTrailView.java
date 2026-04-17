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

@PageTitle("Basic Trail")
@Route(value = "", layout = MainLayout.class)
@Menu(title = "Basic Trail", order = 1)
public class BasicTrailView extends VerticalLayout {

    public BasicTrailView() {
        add(new H2("Basic Breadcrumb Trail"));
        add(new Paragraph(
                "Demonstrates a product catalog breadcrumb (Requirements 1-4, Use Case 1). "
                        + "Click any ancestor item to see a navigate event notification."));

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Electronics", "/electronics"),
                new BreadcrumbItem("Laptops", "/electronics/laptops"),
                new BreadcrumbItem("ThinkPad X1").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        add(breadcrumb);
    }
}
