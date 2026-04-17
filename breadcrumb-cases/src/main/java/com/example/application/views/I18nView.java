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

@PageTitle("I18n")
@Route(value = "i18n", layout = MainLayout.class)
@Menu(title = "I18n", order = 10)
public class I18nView extends VerticalLayout {

    public I18nView() {
        add(new H2("Internationalization (I18n)"));
        add(new Paragraph(
                "Demonstrates Requirement 15: the breadcrumb's accessible labels "
                        + "can be localized. This example uses French labels for the "
                        + "navigation landmark and overflow button."));

        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.setI18n(new Breadcrumb.BreadcrumbI18n()
                .setNavigationLabel("Fil d'Ariane")
                .setOverflow("Afficher les ancêtres masqués"));

        breadcrumb.addItem(
                new BreadcrumbItem("Accueil", "/"),
                new BreadcrumbItem("Produits", "/produits"),
                new BreadcrumbItem("Ordinateurs", "/produits/ordinateurs"),
                new BreadcrumbItem("Portable ThinkPad").asCurrent());

        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigation vers: " + event.getPath());
        });

        add(breadcrumb);
    }
}
