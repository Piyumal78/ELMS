# Student Module

## Overview
The Student module provides the main interface for students to access their labs, view reports, and manage their profile within the ELMS (Electronic Lab Management System). It features a responsive dashboard layout with a sidebar for navigation and a grid view of available laboratory courses.

## File Structure & Imports

### 1. Student.jsx
**Description:** The main container component that implements the student dashboard layout using a persistent drawer sidebar.

**Key Imports:**
- **React:** `useState`, `useTheme`
- **Material UI:** 
  - Components: `Box`, `Drawer`, `CssBaseline`, `AppBar`, `Toolbar`, `List`, `Typography`, `Divider`, `IconButton`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText`
  - Icons: `MenuIcon`, `ChevronLeftIcon`, `ChevronRightIcon`
  - Styles: `styled`
- **Lucide React:** `House`, `Calendar`, `FileText`, `GraduationCap`, `MessageCircleDashed`, `CircuitBoard`
- **Internal Components:** `StudentNavbar`, `StudentDetails`

**Functionalities:**
- **Sidebar State Management:** Uses `useState` to toggle the `open` state of the sidebar drawer.
- **Responsive Layout:** 
  - Uses `styled` components (`Main`, `AppBar`) to dynamically adjust margins and widths when the drawer opens or closes.
  - Implements a transition effect for smooth UI changes.
- **Navigation Rendering:** Maps through a `sidebarItems` array to render navigation links with corresponding icons.
- **Theme Integration:** Utilizes `useTheme` to handle direction-specific logic (LTR/RTL) for icons.

### 2. StudentNavbar.jsx
**Description:** The top navigation bar component providing search capabilities and user profile management.

**Key Imports:**
- **Lucide React:** `SearchIcon`, `LogOut`, `CheckIcon`, `CreditCardIcon`, `InfoIcon`, `MailIcon`, `StarIcon`
- **Shadcn UI Components:** 
  - `InputGroup`, `InputGroupAddon`, `InputGroupInput` (from `@/components/ui/input-group`)
  - `Button` (from `@/components/ui/button`)
  - `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectTrigger`, `SelectValue` (from `@/components/ui/select`)

**Functionalities:**
- **Search Interface:** Displays a styled search input field with an icon.
- **User Profile Menu:** 
  - Renders a dropdown menu using the `Select` component.
  - Displays user information (Name, Role, Avatar placeholder).
  - Provides actions for "Profile Settings", "Preferences", "Help & Support", and "Sign Out".
- **Styling:** Uses Tailwind CSS for layout and hover effects.

### 3. StudentDetails.jsx
**Description:** The main content area displaying the student's enrolled labs in a grid layout.

**Key Imports:**
- **React Router DOM:** `useNavigate`
- **Assets:** `Lab` (image import from `../assets/lab.jpg`)

**Functionalities:**
- **Navigation Handler:** Uses the `useNavigate` hook to programmatically redirect users to specific lab routes (e.g., `/lab1`, `/lab2`) when a card is clicked.
- **Dynamic Content Rendering:** 
  - Defines a `labdetails` array containing lab metadata (Semester, Name, Path).
  - Maps over this array to generate consistent UI cards for each lab.
- **Card UI:** 
  - Displays a cover image, semester badge, and lab title.
  - Implements hover effects (`hover:shadow-lg`) for better interactivity.

## Usage
The Student module is typically accessed via the `/student` route. It serves as the primary landing page for students after logging in.

```jsx
// Example usage in App routes
<Route path='/student' element={<Student />} />
```

## Dependencies
- **@mui/material & @mui/icons-material:** Core layout components and standard icons.
- **lucide-react:** Modern icon set used for sidebar and UI elements.
- **react-router-dom:** For handling client-side navigation.
- **tailwindcss:** For utility-first styling in `StudentNavbar` and `StudentDetails`.
- **Shadcn UI:** Reusable components used in the Navbar.
