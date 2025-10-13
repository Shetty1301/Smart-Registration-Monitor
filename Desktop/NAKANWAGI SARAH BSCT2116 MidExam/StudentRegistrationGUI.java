
// StudentRegistrationGUI.java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class StudentRegistrationGUI extends Application {

    private TextField nameField;
    private TextField regNumberField;
    private TextField courseField;
    private TextArea displayArea;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Student Registration - Bugema University");

        // Create form components
        nameField = new TextField();
        nameField.setPromptText("Enter full name");

        regNumberField = new TextField();
        regNumberField.setPromptText("Enter registration number");

        courseField = new TextField();
        courseField.setPromptText("Enter course");

        Button submitButton = new Button("Submit");
        displayArea = new TextArea();
        displayArea.setEditable(false);
        displayArea.setPromptText("Registered students will appear here...");

        // Submit button action
        submitButton.setOnAction(e -> handleRegistration());

        // Create layout
        VBox layout = new VBox(10);
        layout.getChildren().addAll(
                new Label("Student Registration Form"),
                new Label("Name:"),
                nameField,
                new Label("Registration Number:"),
                regNumberField,
                new Label("Course:"),
                courseField,
                submitButton,
                new Label("Registered Students:"),
                displayArea);

        // Set padding
        layout.setStyle("-fx-padding: 20;");

        Scene scene = new Scene(layout, 500, 500);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void handleRegistration() {
        String name = nameField.getText().trim();
        String regNumber = regNumberField.getText().trim();
        String course = courseField.getText().trim();

        // Input validation
        if (name.isEmpty() || regNumber.isEmpty() || course.isEmpty()) {
            showAlert("All fields are required! Please fill in all information.");
            return;
        }

        // Add to display area
        String studentInfo = String.format(
                "Name: %s\nRegistration: %s\nCourse: %s\n%s\n",
                name, regNumber, course, "=".repeat(30));
        displayArea.appendText(studentInfo);

        // Clear fields
        nameField.clear();
        regNumberField.clear();
        courseField.clear();

        showAlert("Student registered successfully!");
    }

    private void showAlert(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Registration Status");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        launch(args);
    }
}