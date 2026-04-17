package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("Overflow")
@Route(value = "overflow", layout = MainLayout.class)
@Menu(title = "Overflow", order = 9)
public class OverflowView extends VerticalLayout {

    public OverflowView() {
        add(new H2("Overflow Behavior"));
        add(new Paragraph(
                "Demonstrates Requirements 11-14: when a breadcrumb has many items "
                        + "inside a narrow container, intermediate items collapse and an "
                        + "overflow button appears to reveal the hidden ancestors."));

        Div container = new Div();
        container.setWidth("200px");
        container.getStyle()
                .set("border", "1px dashed var(--lumo-contrast-30pct)")
                .set("padding", "var(--lumo-space-s)");

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Region", "/region"),
                new BreadcrumbItem("Country", "/region/country"),
                new BreadcrumbItem("State", "/region/country/state"),
                new BreadcrumbItem("City", "/region/country/state/city"),
                new BreadcrumbItem("District", "/region/country/state/city/district"),
                new BreadcrumbItem("Street", "/region/country/state/city/district/street"),
                new BreadcrumbItem("Building 42").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        container.add(breadcrumb);
        add(container);

        add(new Paragraph("The dashed border shows the 200px container boundary."));
    }
}
