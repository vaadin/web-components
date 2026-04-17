package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("Icons")
@Route(value = "icons", layout = MainLayout.class)
@Menu(title = "Icons", order = 5)
public class IconsView extends VerticalLayout {

    public IconsView() {
        add(new H2("Breadcrumb with Icons"));
        add(new Paragraph(
                "Demonstrates Requirement 7: icon-only root item (home icon) and "
                        + "folder icons on intermediate items via the prefix component API."));

        Breadcrumb breadcrumb = new Breadcrumb();

        BreadcrumbItem home = new BreadcrumbItem(VaadinIcon.HOME.create(), "/");

        BreadcrumbItem documents = new BreadcrumbItem("Documents", "/documents");
        documents.setPrefixComponent(VaadinIcon.FOLDER.create());

        BreadcrumbItem reports = new BreadcrumbItem("Reports", "/documents/reports");
        reports.setPrefixComponent(VaadinIcon.FOLDER.create());

        BreadcrumbItem annualReport = new BreadcrumbItem("Annual Report 2025").asCurrent();
        annualReport.setPrefixComponent(VaadinIcon.FILE_TEXT.create());

        breadcrumb.addItem(home, documents, reports, annualReport);

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });

        add(breadcrumb);
    }
}
