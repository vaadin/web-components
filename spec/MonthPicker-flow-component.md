# MonthPicker Flow Component Specification

## Executive Summary

The MonthPicker Flow component provides a Java API for month and year selection in Vaadin Flow applications. It wraps the `vaadin-month-picker` web component with a type-safe, server-side API following Vaadin Flow patterns and conventions. The component integrates seamlessly with Java time APIs (`java.time.YearMonth`), Binder framework, and supports full internationalization.

## Component Overview

### Package Information

**Package**: `com.vaadin.flow.component.monthpicker`
**Module**: `vaadin-month-picker-flow`
**Main Class**: `MonthPicker`
**Base Classes**: `AbstractField<MonthPicker, YearMonth>`, `HasSize`, `HasValidation`, `HasStyle`, `HasTheme`
**Java Version**: 21+
**Flow Version**: 24.6+

### Maven Dependency

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-month-picker-flow</artifactId>
    <version>${vaadin.version}</version>
</dependency>
```

### Gradle Dependency

```gradle
dependencies {
    implementation "com.vaadin:vaadin-month-picker-flow:${vaadinVersion}"
}
```

## Usage Examples

### Basic Usage

```java
MonthPicker monthPicker = new MonthPicker();
monthPicker.setLabel("Select Month");
add(monthPicker);
```

### With Label and Initial Value

```java
MonthPicker reportMonth = new MonthPicker("Report Month");
reportMonth.setValue(YearMonth.of(2025, 3));
add(reportMonth);
```

### With Value Change Listener

```java
MonthPicker monthPicker = new MonthPicker("Billing Month");

monthPicker.addValueChangeListener(event -> {
    YearMonth selected = event.getValue();
    if (selected != null) {
        Notification.show("Selected: " + selected);
    }
});
```

### With Min/Max Validation

```java
MonthPicker monthPicker = new MonthPicker("Select Month");
monthPicker.setMin(YearMonth.of(2025, 1));
monthPicker.setMax(YearMonth.of(2025, 12));
monthPicker.setValue(YearMonth.of(2025, 3));
```

### Required Field

```java
MonthPicker monthPicker = new MonthPicker("Start Month");
monthPicker.setRequiredIndicatorVisible(true);
monthPicker.setErrorMessage("Month is required");
```

### With Helper Text

```java
MonthPicker monthPicker = new MonthPicker("Subscription Month");
monthPicker.setHelperText("Select the month your subscription starts");
```

### With Binder

```java
public class ReportForm extends Div {
    private MonthPicker reportMonth = new MonthPicker("Report Month");
    private Binder<Report> binder = new Binder<>(Report.class);

    public ReportForm() {
        binder.forField(reportMonth)
            .asRequired("Report month is required")
            .withValidator(
                month -> month.isAfter(YearMonth.now().minusYears(1)),
                "Month must be within last year"
            )
            .bind(Report::getReportMonth, Report::setReportMonth);

        add(reportMonth);
    }
}
```

### With Custom Validation

```java
MonthPicker startMonth = new MonthPicker("Start Month");
MonthPicker endMonth = new MonthPicker("End Month");

Binder<DateRange> binder = new Binder<>();

binder.forField(startMonth)
    .asRequired("Start month required")
    .bind(DateRange::getStart, DateRange::setStart);

binder.forField(endMonth)
    .asRequired("End month required")
    .withValidator(
        end -> end.isAfter(startMonth.getValue()),
        "End must be after start"
    )
    .bind(DateRange::getEnd, DateRange::setEnd);
```

### With Internationalization

```java
MonthPicker monthPicker = new MonthPicker("Monat auswählen");

MonthPickerI18n i18n = new MonthPickerI18n();
i18n.setMonthNames(List.of(
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
));
i18n.setClear("Löschen");
i18n.setCancel("Abbrechen");

monthPicker.setI18n(i18n);
monthPicker.setLocale(Locale.GERMAN);
```

### Disabled and ReadOnly

```java
MonthPicker disabledPicker = new MonthPicker("Disabled");
disabledPicker.setEnabled(false);

MonthPicker readOnlyPicker = new MonthPicker("Read-Only");
readOnlyPicker.setReadOnly(true);
readOnlyPicker.setValue(YearMonth.of(2025, 3));
```

### Programmatic Control

```java
Button openButton = new Button("Open Picker", event -> {
    monthPicker.open();
});

Button closeButton = new Button("Close Picker", event -> {
    monthPicker.close();
});

Button validateButton = new Button("Validate", event -> {
    boolean isValid = monthPicker.validate();
    Notification.show("Valid: " + isValid);
});
```

## Java API

### Constructors

```java
// Empty constructor
public MonthPicker()

// With label
public MonthPicker(String label)

// With label and initial value
public MonthPicker(String label, YearMonth initialValue)

// With label and value change listener
public MonthPicker(String label,
    ValueChangeListener<ComponentValueChangeEvent<MonthPicker, YearMonth>> listener)

// With initial value and value change listener
public MonthPicker(YearMonth initialValue,
    ValueChangeListener<ComponentValueChangeEvent<MonthPicker, YearMonth>> listener)
```

### Value Methods

```java
// Get current value (null if empty)
public YearMonth getValue()

// Set value (null to clear)
public void setValue(YearMonth value)

// Set value and specify if user originated
public void setValue(YearMonth value, boolean fromClient)

// Clear value
public void clear()

// Get empty value (always null for MonthPicker)
public YearMonth getEmptyValue()
```

### Label and Text Methods

```java
// Label
public String getLabel()
public void setLabel(String label)

// Placeholder
public String getPlaceholder()
public void setPlaceholder(String placeholder)

// Helper text
public String getHelperText()
public void setHelperText(String helperText)

// Error message
public String getErrorMessage()
public void setErrorMessage(String errorMessage)
```

### Validation Methods

```java
// Required indicator
public boolean isRequiredIndicatorVisible()
public void setRequiredIndicatorVisible(boolean required)

// Invalid state
public boolean isInvalid()
public void setInvalid(boolean invalid)

// Min/Max constraints
public YearMonth getMin()
public void setMin(YearMonth min)

public YearMonth getMax()
public void setMax(YearMonth max)

// Validation
public boolean validate()
```

### UI State Methods

```java
// Enabled state
public boolean isEnabled()
public void setEnabled(boolean enabled)

// ReadOnly state
public boolean isReadOnly()
public void setReadOnly(boolean readOnly)

// Overlay opened state
public boolean isOpened()
public void setOpened(boolean opened)

// Auto-open disabled
public boolean isAutoOpenDisabled()
public void setAutoOpenDisabled(boolean autoOpenDisabled)

// Clear button visibility
public boolean isClearButtonVisible()
public void setClearButtonVisible(boolean clearButtonVisible)
```

### Internationalization Methods

```java
// Set i18n configuration
public void setI18n(MonthPickerI18n i18n)
public MonthPickerI18n getI18n()

// Set locale (for automatic month names)
public void setLocale(Locale locale)
public Locale getLocale()
```

### Overlay Control Methods

```java
// Open overlay programmatically
public void open()

// Close overlay programmatically
public void close()
```

### Event Listeners

```java
// Value change
public Registration addValueChangeListener(
    ValueChangeListener<ComponentValueChangeEvent<MonthPicker, YearMonth>> listener)

// Opened changed
public Registration addOpenedChangeListener(
    ComponentEventListener<OpenedChangeEvent> listener)

// Invalid changed
public Registration addInvalidChangeListener(
    ComponentEventListener<InvalidChangeEvent> listener)

// Validated
public Registration addValidatedListener(
    ComponentEventListener<ValidatedEvent> listener)
```

### Component Methods (from Interfaces)

```java
// HasSize
public void setWidth(String width)
public void setHeight(String height)
public void setSizeFull()
public void setSizeUndefined()

// HasStyle
public void addClassName(String className)
public void setClassName(String className)
public Style getStyle()

// HasTheme
public void addThemeVariants(MonthPickerVariant... variants)
public void removeThemeVariants(MonthPickerVariant... variants)

// Focusable
public void focus()
public void blur()
```

## MonthPickerI18n Class

### Properties

```java
public class MonthPickerI18n implements Serializable {

    // Month names (full)
    private List<String> monthNames;

    // Button labels
    private String clear;
    private String cancel;

    // Getters and Setters
    public List<String> getMonthNames() { ... }
    public void setMonthNames(List<String> monthNames) { ... }

    public String getClear() { ... }
    public void setClear(String clear) { ... }

    public String getCancel() { ... }
    public void setCancel(String cancel) { ... }
}
```

### Factory Methods

```java
// Create i18n for common locales
public static MonthPickerI18n forLocale(Locale locale)

// Example usage:
MonthPickerI18n germanI18n = MonthPickerI18n.forLocale(Locale.GERMAN);
monthPicker.setI18n(germanI18n);
```

### Default i18n

```java
// English (default)
MonthPickerI18n defaultI18n = new MonthPickerI18n();
defaultI18n.setMonthNames(List.of(
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
));
defaultI18n.setClear("Clear");
defaultI18n.setCancel("Cancel");
```

## Events

### ValueChangeEvent

```java
public class ComponentValueChangeEvent<C extends Component, V> extends ValueChangeEvent<V> {

    // Get the component
    public MonthPicker getSource()

    // Get old value
    public YearMonth getOldValue()

    // Get new value
    public YearMonth getValue()

    // Check if from client
    public boolean isFromClient()
}
```

### OpenedChangeEvent

```java
public class OpenedChangeEvent extends ComponentEvent<MonthPicker> {

    // Check if opened
    public boolean isOpened()
}
```

### InvalidChangeEvent

```java
public class InvalidChangeEvent extends ComponentEvent<MonthPicker> {

    // Check if invalid
    public boolean isInvalid()
}
```

### ValidatedEvent

```java
public class ValidatedEvent extends ComponentEvent<MonthPicker> {

    // Check if valid
    public boolean isValid()
}
```

## Theme Variants

### MonthPickerVariant Enum

```java
public enum MonthPickerVariant {
    // Lumo theme variants
    LUMO_SMALL,
    LUMO_ALIGN_LEFT,
    LUMO_ALIGN_CENTER,
    LUMO_ALIGN_RIGHT,
    LUMO_HELPER_ABOVE_FIELD,
    LUMO_WHITESPACE_NOWRAP;

    // Get variant name
    public String getVariantName() { ... }
}
```

### Usage

```java
MonthPicker monthPicker = new MonthPicker();
monthPicker.addThemeVariants(
    MonthPickerVariant.LUMO_SMALL,
    MonthPickerVariant.LUMO_ALIGN_CENTER
);
```

## Integration Patterns

### Form Integration

```java
public class SubscriptionForm extends FormLayout {

    private TextField customerName = new TextField("Customer Name");
    private MonthPicker startMonth = new MonthPicker("Start Month");
    private MonthPicker endMonth = new MonthPicker("End Month");

    private Binder<Subscription> binder = new Binder<>(Subscription.class);

    public SubscriptionForm() {
        // Bind fields
        binder.forField(customerName)
            .asRequired("Name is required")
            .bind(Subscription::getCustomerName, Subscription::setCustomerName);

        binder.forField(startMonth)
            .asRequired("Start month is required")
            .withValidator(
                month -> month.isAfter(YearMonth.now().minusMonths(1)),
                "Cannot start in the past"
            )
            .bind(Subscription::getStartMonth, Subscription::setStartMonth);

        binder.forField(endMonth)
            .asRequired("End month is required")
            .withValidator(
                month -> startMonth.getValue() == null ||
                         month.isAfter(startMonth.getValue()),
                "End must be after start"
            )
            .bind(Subscription::getEndMonth, Subscription::setEndMonth);

        add(customerName, startMonth, endMonth);

        setResponsiveSteps(
            new ResponsiveStep("0", 1),
            new ResponsiveStep("500px", 2)
        );
    }

    public void setBean(Subscription subscription) {
        binder.setBean(subscription);
    }

    public boolean validate() {
        return binder.validate().isOk();
    }
}
```

### CRUD Integration

```java
public class ReportView extends VerticalLayout {

    private Grid<Report> grid = new Grid<>(Report.class);
    private MonthPicker filterMonth = new MonthPicker("Filter by Month");
    private ReportService reportService;

    public ReportView(ReportService reportService) {
        this.reportService = reportService;

        // Filter configuration
        filterMonth.setClearButtonVisible(true);
        filterMonth.addValueChangeListener(event -> {
            refreshGrid();
        });

        // Grid configuration
        grid.setItems(query -> reportService.findAll(
            filterMonth.getValue(),
            query.getOffset(),
            query.getLimit()
        ).stream());

        add(filterMonth, grid);
    }

    private void refreshGrid() {
        grid.getDataProvider().refreshAll();
    }
}
```

### Service Layer Integration

```java
@Service
public class ReportService {

    @Autowired
    private ReportRepository repository;

    public List<Report> findByMonth(YearMonth month) {
        LocalDate startOfMonth = month.atDay(1);
        LocalDate endOfMonth = month.atEndOfMonth();

        return repository.findByDateBetween(startOfMonth, endOfMonth);
    }

    public Report createReport(YearMonth reportMonth) {
        Report report = new Report();
        report.setReportMonth(reportMonth);
        report.setCreatedDate(LocalDateTime.now());
        return repository.save(report);
    }
}
```

### JPA Entity Integration

```java
@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store as separate year and month columns
    @Column(nullable = false)
    private int reportYear;

    @Column(nullable = false)
    private int reportMonth;

    // Transient YearMonth field for convenience
    @Transient
    public YearMonth getReportMonth() {
        return YearMonth.of(reportYear, reportMonth);
    }

    public void setReportMonth(YearMonth yearMonth) {
        this.reportYear = yearMonth.getYear();
        this.reportMonth = yearMonth.getMonthValue();
    }

    // Alternative: Store as LocalDate (first day of month)
    @Column(name = "report_date")
    private LocalDate reportDate;

    @Transient
    public YearMonth getReportMonthFromDate() {
        return reportDate != null ? YearMonth.from(reportDate) : null;
    }

    public void setReportMonthFromDate(YearMonth yearMonth) {
        this.reportDate = yearMonth != null ? yearMonth.atDay(1) : null;
    }
}
```

### REST API Integration

```java
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public List<Report> getReports(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return reportService.findByMonth(month);
    }

    @PostMapping
    public Report createReport(
            @RequestBody @Valid ReportRequest request) {
        return reportService.createReport(request.getReportMonth());
    }
}

// Request DTO
public class ReportRequest {

    @NotNull
    @JsonFormat(pattern = "yyyy-MM")
    private YearMonth reportMonth;

    // Getters and setters
}
```

## Validation

### Built-in Validation

```java
MonthPicker monthPicker = new MonthPicker("Month");

// Required validation
monthPicker.setRequiredIndicatorVisible(true);
monthPicker.setErrorMessage("Month is required");

// Min/Max validation
monthPicker.setMin(YearMonth.of(2025, 1));
monthPicker.setMax(YearMonth.of(2025, 12));

// Manual validation
Button submitButton = new Button("Submit", event -> {
    if (monthPicker.validate()) {
        // Process valid value
        Notification.show("Valid: " + monthPicker.getValue());
    } else {
        // Show error
        Notification.show("Please correct errors", 3000, Position.MIDDLE)
            .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }
});
```

### Binder Validation

```java
Binder<MonthlyReport> binder = new Binder<>();

// Required validation
binder.forField(reportMonth)
    .asRequired("Report month is required")
    .bind(MonthlyReport::getReportMonth, MonthlyReport::setReportMonth);

// Range validation
binder.forField(reportMonth)
    .withValidator(
        month -> month.getYear() >= 2020,
        "Must be 2020 or later"
    )
    .withValidator(
        month -> month.isBefore(YearMonth.now().plusYears(1)),
        "Cannot be more than 1 year in future"
    )
    .bind(MonthlyReport::getReportMonth, MonthlyReport::setReportMonth);

// Cross-field validation
Binder.Binding<MonthlyReport, YearMonth> endBinding =
    binder.forField(endMonth)
        .asRequired("End month is required")
        .bind(MonthlyReport::getEndMonth, MonthlyReport::setEndMonth);

binder.withValidator(
    report -> report.getEndMonth().isAfter(report.getStartMonth()),
    "End month must be after start month"
);
```

### Custom Validators

```java
public class MonthRangeValidator implements Validator<YearMonth> {

    private final YearMonth min;
    private final YearMonth max;
    private final String errorMessage;

    public MonthRangeValidator(YearMonth min, YearMonth max, String errorMessage) {
        this.min = min;
        this.max = max;
        this.errorMessage = errorMessage;
    }

    @Override
    public ValidationResult apply(YearMonth value, ValueContext context) {
        if (value == null) {
            return ValidationResult.ok();
        }

        if (value.isBefore(min) || value.isAfter(max)) {
            return ValidationResult.error(errorMessage);
        }

        return ValidationResult.ok();
    }
}

// Usage
binder.forField(monthPicker)
    .withValidator(new MonthRangeValidator(
        YearMonth.of(2025, 1),
        YearMonth.of(2025, 12),
        "Month must be in 2025"
    ))
    .bind(Report::getReportMonth, Report::setReportMonth);
```

### Bean Validation (JSR-303)

```java
@Entity
public class Subscription {

    @NotNull(message = "Start month is required")
    private YearMonth startMonth;

    @NotNull(message = "End month is required")
    @Future(message = "End month must be in future")
    private YearMonth endMonth;

    @AssertTrue(message = "End must be after start")
    public boolean isValidDateRange() {
        return endMonth == null || startMonth == null ||
               endMonth.isAfter(startMonth);
    }
}

// In component
Binder<Subscription> binder = new BeanValidationBinder<>(Subscription.class);
binder.bindInstanceFields(this);
```

## Internationalization

### Automatic Locale Detection

```java
// Uses UI locale automatically
MonthPicker monthPicker = new MonthPicker();
monthPicker.setLocale(UI.getCurrent().getLocale());

// Month names automatically derived from locale
```

### Manual i18n Configuration

```java
public class LocalizedMonthPicker extends MonthPicker {

    public LocalizedMonthPicker(String label, Locale locale) {
        super(label);
        setLocale(locale);
        setI18n(createI18nForLocale(locale));
    }

    private static MonthPickerI18n createI18nForLocale(Locale locale) {
        MonthPickerI18n i18n = new MonthPickerI18n();

        // Generate month names using locale
        DateFormatSymbols symbols = DateFormatSymbols.getInstance(locale);
        i18n.setMonthNames(Arrays.asList(symbols.getMonths())
            .subList(0, 12)); // Exclude empty 13th element

        // Localize button labels
        ResourceBundle bundle = ResourceBundle.getBundle("messages", locale);
        i18n.setClear(bundle.getString("monthpicker.clear"));
        i18n.setCancel(bundle.getString("monthpicker.cancel"));

        return i18n;
    }
}
```

### ResourceBundle Integration

```properties
# messages_en.properties
monthpicker.clear=Clear
monthpicker.cancel=Cancel
monthpicker.placeholder=Select month
monthpicker.error.required=Month is required
monthpicker.error.min=Month must be after {0}
monthpicker.error.max=Month must be before {0}

# messages_de.properties
monthpicker.clear=Löschen
monthpicker.cancel=Abbrechen
monthpicker.placeholder=Monat auswählen
monthpicker.error.required=Monat ist erforderlich
monthpicker.error.min=Monat muss nach {0} liegen
monthpicker.error.max=Monat muss vor {0} liegen
```

```java
public void configureWithResourceBundle(MonthPicker picker, Locale locale) {
    ResourceBundle bundle = ResourceBundle.getBundle("messages", locale);

    MonthPickerI18n i18n = new MonthPickerI18n();
    i18n.setClear(bundle.getString("monthpicker.clear"));
    i18n.setCancel(bundle.getString("monthpicker.cancel"));

    // Auto-generate month names
    DateFormatSymbols symbols = DateFormatSymbols.getInstance(locale);
    i18n.setMonthNames(Arrays.asList(symbols.getMonths()).subList(0, 12));

    picker.setI18n(i18n);
    picker.setPlaceholder(bundle.getString("monthpicker.placeholder"));
}
```

## Implementation Plan

### Phase 1: Core Java Component

**Goal**: Basic MonthPicker with YearMonth support

**Tasks**:
1. Create `MonthPicker` class extending `AbstractField`
2. Implement constructors
3. Implement value property with YearMonth type
4. Implement label, placeholder, helperText properties
5. Implement disabled state
6. Create synchronization between client and server
7. Write unit tests

**Deliverables**:
- `MonthPicker.java` - Main component class
- Unit tests
- Basic documentation

### Phase 2: Validation & Constraints

**Goal**: Full validation support

**Tasks**:
1. Implement required validation
2. Implement min/max constraints
3. Implement invalid state and error messages
4. Implement `validate()` method
5. Add Binder integration tests
6. Support Bean Validation annotations

**Deliverables**:
- Validation implementation
- Binder integration
- Validation tests

### Phase 3: Internationalization

**Goal**: Full i18n support

**Tasks**:
1. Create `MonthPickerI18n` class
2. Implement i18n property synchronization
3. Add locale support with automatic month names
4. Create helper methods for common locales
5. Add ResourceBundle integration examples
6. Write i18n tests

**Deliverables**:
- `MonthPickerI18n.java`
- Locale support
- I18n documentation

### Phase 4: Events & Listeners

**Goal**: Complete event system

**Tasks**:
1. Implement value change events
2. Implement opened change events
3. Implement invalid change events
4. Implement validated events
5. Write event tests

**Deliverables**:
- Event classes
- Listener methods
- Event tests

### Phase 5: Theme Variants & Styling

**Goal**: Theme support

**Tasks**:
1. Create `MonthPickerVariant` enum
2. Implement theme variant support
3. Add Lumo variants
4. Add Aura variant support (if applicable)
5. Document styling options

**Deliverables**:
- `MonthPickerVariant.java`
- Theme documentation
- Visual tests

### Phase 6: Advanced Features

**Goal**: Polish and advanced functionality

**Tasks**:
1. Implement readonly state
2. Implement autoOpenDisabled
3. Implement clear button visibility
4. Add overlay control methods (open/close)
5. Optimize serialization
6. Add JavaDoc for all public APIs

**Deliverables**:
- Complete feature set
- Full JavaDoc
- Performance optimization

### Phase 7: Documentation & Examples

**Goal**: Production-ready documentation

**Tasks**:
1. Write comprehensive JavaDoc
2. Create usage examples
3. Write integration guides (JPA, REST, etc.)
4. Create migration guide (if needed)
5. Add to vaadin.com/docs
6. Create demo applications

**Deliverables**:
- Complete JavaDoc
- Documentation on vaadin.com
- Demo applications
- Integration examples

## vaadin.com/docs Documentation

### Overview Page

**Title**: MonthPicker - Java

**Description**:
MonthPicker allows users to select a month and year using Java's `YearMonth` type. It's ideal for business applications requiring month-level precision for financial reporting, billing cycles, or subscription management.

**When to Use**:
- Monthly report date selection
- Subscription period configuration
- Billing cycle selection
- Month-based data filtering

**When Not to Use**:
- Day-level precision needed (use DatePicker)
- Time selection needed (use DateTimePicker)
- Date range selection (use DatePicker range mode)

### Basic Usage

```java
MonthPicker monthPicker = new MonthPicker("Report Month");
monthPicker.setValue(YearMonth.of(2025, 3));
add(monthPicker);
```

### Working with YearMonth

```java
// Get value
YearMonth selected = monthPicker.getValue();

// Check if value exists
if (selected != null) {
    int year = selected.getYear();
    int month = selected.getMonthValue();
    Month monthEnum = selected.getMonth();

    // Convert to LocalDate (first day of month)
    LocalDate firstDay = selected.atDay(1);

    // Convert to LocalDate (last day of month)
    LocalDate lastDay = selected.atEndOfMonth();
}
```

### Validation

```java
MonthPicker monthPicker = new MonthPicker("Month");
monthPicker.setRequiredIndicatorVisible(true);
monthPicker.setMin(YearMonth.of(2025, 1));
monthPicker.setMax(YearMonth.of(2025, 12));
monthPicker.setErrorMessage("Month must be in 2025");
```

### Binder Integration

```java
Binder<Report> binder = new Binder<>(Report.class);

binder.forField(monthPicker)
    .asRequired("Month is required")
    .bind(Report::getReportMonth, Report::setReportMonth);
```

### Internationalization

```java
MonthPickerI18n germanI18n = new MonthPickerI18n();
germanI18n.setMonthNames(List.of(
    "Januar", "Februar", "März", ...
));
germanI18n.setClear("Löschen");
germanI18n.setCancel("Abbrechen");

monthPicker.setI18n(germanI18n);
```

### Database Integration

```java
@Entity
public class Report {
    @Column(name = "report_date")
    private LocalDate reportDate; // First day of month

    @Transient
    public YearMonth getReportMonth() {
        return reportDate != null ? YearMonth.from(reportDate) : null;
    }

    public void setReportMonth(YearMonth yearMonth) {
        this.reportDate = yearMonth != null ? yearMonth.atDay(1) : null;
    }
}
```

## Testing Strategy

### Unit Tests

```java
@Test
public void testBasicValue() {
    MonthPicker picker = new MonthPicker();
    YearMonth value = YearMonth.of(2025, 3);

    picker.setValue(value);

    assertEquals(value, picker.getValue());
}

@Test
public void testMinMaxValidation() {
    MonthPicker picker = new MonthPicker();
    picker.setMin(YearMonth.of(2025, 1));
    picker.setMax(YearMonth.of(2025, 12));

    picker.setValue(YearMonth.of(2024, 12));
    assertFalse(picker.validate());

    picker.setValue(YearMonth.of(2025, 6));
    assertTrue(picker.validate());
}

@Test
public void testRequiredValidation() {
    MonthPicker picker = new MonthPicker();
    picker.setRequiredIndicatorVisible(true);

    assertFalse(picker.validate());

    picker.setValue(YearMonth.of(2025, 3));
    assertTrue(picker.validate());
}
```

### Integration Tests

```java
@Test
public void testBinderIntegration() {
    MonthPicker picker = new MonthPicker();
    Binder<Report> binder = new Binder<>(Report.class);

    binder.forField(picker)
        .asRequired()
        .bind(Report::getReportMonth, Report::setReportMonth);

    Report report = new Report();
    binder.setBean(report);

    picker.setValue(YearMonth.of(2025, 3));

    assertEquals(YearMonth.of(2025, 3), report.getReportMonth());
}
```

## Migration Guide

### From DatePicker to MonthPicker

#### Before (DatePicker)

```java
DatePicker datePicker = new DatePicker("Month");
datePicker.setValue(LocalDate.of(2025, 3, 1));

// Get month from date
LocalDate value = datePicker.getValue();
YearMonth month = YearMonth.from(value);
```

#### After (MonthPicker)

```java
MonthPicker monthPicker = new MonthPicker("Month");
monthPicker.setValue(YearMonth.of(2025, 3));

// Direct YearMonth access
YearMonth month = monthPicker.getValue();
```

**Benefits**:
- Cleaner API (no day component)
- Type safety with YearMonth
- Better UX for month selection
- No need to convert LocalDate ↔ YearMonth

## Breaking Changes Policy

### Stable API (v1.0+)

1. **Public Methods**: All documented public methods
2. **Properties**: All setters/getters
3. **Events**: Event types and listener interfaces
4. **Value Type**: `YearMonth` as value type
5. **i18n**: `MonthPickerI18n` structure

### Internal Implementation (Can Change)

1. Client-server synchronization details
2. Internal state management
3. Private methods

### Deprecation Process

1. Mark as `@Deprecated` with JavaDoc explaining alternative
2. Maintain for minimum 1 major version
3. Provide migration guide
4. Remove in next major version

## References

1. MonthPicker Web Component Specification (companion document)
2. [Vaadin Flow Documentation](https://vaadin.com/docs/latest/flow/overview)
3. [AbstractField JavaDoc](https://vaadin.com/api/platform/)
4. [Binder Documentation](https://vaadin.com/docs/latest/binding-data/components-binder)
5. [Java YearMonth Documentation](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/YearMonth.html)
6. [JSR-303 Bean Validation](https://beanvalidation.org/)
