package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("Custom Separator")
@Route(value = "custom-separator", layout = MainLayout.class)
@Menu(title = "Custom Separator", order = 8)
public class CustomSeparatorView extends VerticalLayout {

    public CustomSeparatorView() {
        add(new H2("Custom Separators"));
        add(new Paragraph(
                "Demonstrates Requirement 10: breadcrumbs can use custom separators "
                        + "instead of the default chevron."));

        add(new H3("Default separator"));
        Breadcrumb defaultSep = createBreadcrumb();
        add(defaultSep);

        add(new H3("Slash separator"));
        Breadcrumb slashSep = createBreadcrumb();
        slashSep.setSeparator(new Span("/"));
        add(slashSep);

        add(new H3("Greater-than separator"));
        Breadcrumb gtSep = createBreadcrumb();
        gtSep.setSeparator(new Span(">"));
        add(gtSep);

        add(new H3("Custom icon separator"));
        Breadcrumb iconSep = createBreadcrumb();
        Icon arrow = VaadinIcon.ARROW_RIGHT.create();
        arrow.setSize("12px");
        iconSep.setSeparator(arrow);
        add(iconSep);
    }

    private Breadcrumb createBreadcrumb() {
        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("Home", "/"),
                new BreadcrumbItem("Products", "/products"),
                new BreadcrumbItem("Accessories", "/products/accessories"),
                new BreadcrumbItem("Keyboards").asCurrent());
        return breadcrumb;
    }
}
