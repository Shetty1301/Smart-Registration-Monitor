
// StudentRegistrationConsole.java
import java.util.ArrayList;
import java.util.Scanner;

public class StudentRegistrationConsole {
    private static ArrayList<String> students = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("=== STUDENT REGISTRATION SYSTEM ===");
        System.out.println("Bugema University - Department of Computing and Informatics");

        while (true) {
            displayMenu();
            int choice = getIntInput("Choose option: ");

            switch (choice) {
                case 1 -> registerStudent();
                case 2 -> viewStudents();
                case 3 -> {
                    System.out.println("Thank you for using Student Registration System!");
                    return;
                }
                default -> System.out.println("Invalid choice! Please try again.");
            }
        }
    }

    private static void displayMenu() {
        System.out.println("\n=== MAIN MENU ===");
        System.out.println("1. Register New Student");
        System.out.println("2. View All Students");
        System.out.println("3. Exit");
    }

    private static void registerStudent() {
        System.out.println("\n=== REGISTER NEW STUDENT ===");

        System.out.print("Enter student name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter registration number: ");
        String regNumber = scanner.nextLine().trim();

        System.out.print("Enter course: ");
        String course = scanner.nextLine().trim();

        // Input validation
        if (name.isEmpty() || regNumber.isEmpty() || course.isEmpty()) {
            System.out.println("❌ Error: All fields are required!");
            return;
        }

        // Save student
        String studentRecord = String.format("Name: %s | Reg: %s | Course: %s",
                name, regNumber, course);
        students.add(studentRecord);

        System.out.println("✅ Student registered successfully!");
    }

    private static void viewStudents() {
        System.out.println("\n=== REGISTERED STUDENTS ===");

        if (students.isEmpty()) {
            System.out.println("No students registered yet.");
            return;
        }

        System.out.println("Total students: " + students.size());
        System.out.println("----------------------------------------");

        for (int i = 0; i < students.size(); i++) {
            System.out.println((i + 1) + ". " + students.get(i));
        }
    }

    private static int getIntInput(String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                return Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input! Please enter a number.");
            }
        }
    }
}