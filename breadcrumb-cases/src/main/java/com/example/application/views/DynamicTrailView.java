package com.example.application.views;

import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.select.Select;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

@PageTitle("Dynamic Trail")
@Route(value = "dynamic-trail", layout = MainLayout.class)
@Menu(title = "Dynamic Trail", order = 4)
public class DynamicTrailView extends VerticalLayout {

    private final Breadcrumb breadcrumb;
    private final List<String> trail = new ArrayList<>();

    public DynamicTrailView() {
        add(new H2("Dynamic Breadcrumb Trail"));
        add(new Paragraph(
                "Demonstrates Requirement 6 (Use Case 4): the breadcrumb updates "
                        + "dynamically as the user navigates deeper into a folder structure. "
                        + "Select a folder and click 'Navigate' to go deeper, or click 'Reset' "
                        + "to start over."));

        trail.add("Home");

        Select<String> folderSelect = new Select<>();
        folderSelect.setLabel("Select folder");
        folderSelect.setItems("Documents", "Photos", "Music", "Projects", "Archives");
        folderSelect.setValue("Documents");

        Button navigateButton = new Button("Navigate Into Folder");
        Button resetButton = new Button("Reset");

        HorizontalLayout controls = new HorizontalLayout(folderSelect, navigateButton, resetButton);
        controls.setAlignItems(Alignment.END);
        add(controls);

        breadcrumb = new Breadcrumb();
        breadcrumb.addNavigateListener(event -> {
            Notification.show("Navigating to: " + event.getPath());
        });
        updateBreadcrumb();
        add(breadcrumb);

        navigateButton.addClickListener(event -> {
            String selected = folderSelect.getValue();
            if (selected != null) {
                trail.add(selected);
                updateBreadcrumb();
            }
        });

        resetButton.addClickListener(event -> {
            trail.clear();
            trail.add("Home");
            updateBreadcrumb();
        });
    }

    private void updateBreadcrumb() {
        List<BreadcrumbItem> items = new ArrayList<>();
        StringBuilder pathBuilder = new StringBuilder();

        for (int i = 0; i < trail.size(); i++) {
            String name = trail.get(i);
            if (i == 0) {
                pathBuilder.append("/");
            } else {
                pathBuilder.append("/").append(name.toLowerCase().replace(" ", "-"));
            }

            if (i == trail.size() - 1) {
                items.add(new BreadcrumbItem(name).asCurrent());
            } else {
                items.add(new BreadcrumbItem(name, pathBuilder.toString()));
            }
        }

        breadcrumb.setItems(items.toArray(new BreadcrumbItem[0]));
    }
}
