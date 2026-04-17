package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("Auto Trail")
@Route(value = "auto-trail", layout = MainLayout.class)
@Menu(title = "Auto Trail", order = 12)
public class AutoTrailView extends VerticalLayout {

    public AutoTrailView() {
        add(new H2("Automatic Breadcrumb Trail"));
        add(new Paragraph(
                "Demonstrates Requirement 19 (Flow-only): adding an empty Breadcrumb "
                        + "with no items causes it to auto-populate from the view hierarchy "
                        + "using AfterNavigationObserver, which is already implemented on "
                        + "the Breadcrumb component."));

        Breadcrumb breadcrumb = new Breadcrumb();
        add(breadcrumb);

        add(new Paragraph(
                "The breadcrumb above has no manually added items. It should "
                        + "auto-populate based on the current route and layout hierarchy."));
    }
}
