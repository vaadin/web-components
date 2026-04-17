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

@PageTitle("RTL Support")
@Route(value = "rtl", layout = MainLayout.class)
@Menu(title = "RTL Support", order = 11)
public class RtlView extends VerticalLayout {

    public RtlView() {
        add(new H2("Right-to-Left (RTL) Support"));
        add(new Paragraph(
                "Demonstrates Requirement 18: the breadcrumb renders correctly "
                        + "inside a right-to-left context with Arabic labels."));

        Div rtlContainer = new Div();
        rtlContainer.getElement().setAttribute("dir", "rtl");
        rtlContainer.getStyle()
                .set("border", "1px dashed var(--lumo-contrast-30pct)")
                .set("padding", "var(--lumo-space-m)");

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.addItem(
                new BreadcrumbItem("\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", "/"),
                new BreadcrumbItem("\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", "/products"),
                new BreadcrumbItem("\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A", "/products/electronics"),
                new BreadcrumbItem("\u0627\u0644\u062D\u0648\u0627\u0633\u064A\u0628 \u0627\u0644\u0645\u062D\u0645\u0648\u0644\u0629").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        rtlContainer.add(breadcrumb);
        add(rtlContainer);

        add(new Paragraph("The dashed border indicates the RTL container."));
    }
}
