# RTK Query Setup - Backend API Integration

## ✅ Installed Packages
- `@reduxjs/toolkit` (includes RTK Query)
- `react-redux`

## 📁 Created Files

### 1. API Service (`src/services/api.js`)
Main RTK Query API configuration with all backend endpoints.

**Available Endpoints:**
- **Authentication**: `login`, `activateAccount`
- **Students**: `createStudent`, `getStudentById`
- **Courses**: `getCourses`, `getCourseById`
- **Sessions**: `getSessions`, `getSessionById`
- **Announcements**: `getAnnouncements`
- **Lab Reservations**: `createLabReservation`, `getLabReservations`
- **Report Submission**: `submitReport`

### 2. Redux Store (`src/lib/redux/store.js`)
Configured Redux store with:
- RTK Query middleware
- Auth slice (for token management)
- UI slice (existing)

### 3. Updated Main Entry (`src/main.jsx`)
Added Redux Provider to wrap the app.

### 4. Example Component (`src/components/LoginExample.jsx`)
Shows how to use RTK Query hooks for login and account activation.

## 🚀 How to Use RTK Query

### Basic Query Example
```jsx
import { useGetCoursesQuery } from '../services/api';

function CourseList() {
  const { data, error, isLoading } = useGetCoursesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(course => (
        <div key={course.id}>{course.courseName}</div>
      ))}
    </div>
  );
}
```

### Basic Mutation Example
```jsx
import { useCreateStudentMutation } from '../services/api';

function CreateStudent() {
  const [createStudent, { isLoading, error }] = useCreateStudentMutation();

  const handleSubmit = async (formData) => {
    try {
      const result = await createStudent(formData).unwrap();
      console.log('Student created:', result);
    } catch (err) {
      console.error('Failed to create student:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button disabled={isLoading}>Create</button>
    </form>
  );
}
```

### Using Authentication
```jsx
import { useLoginMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../lib/redux/store';

function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      dispatch(setCredentials({ 
        token: result.token, 
        user: credentials.username 
      }));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

## 🔒 Authentication Flow

1. **Token Storage**: Tokens are automatically stored in Redux and localStorage
2. **Auto-Injection**: Token is automatically included in all API requests
3. **Logout**: Use `logout()` action to clear credentials

```jsx
import { useDispatch } from 'react-redux';
import { logout } from '../lib/redux/store';

function LogoutButton() {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(logout())}>Logout</button>;
}
```

## 🎯 Key Features

✅ **Automatic Caching**: Data is cached and reused across components
✅ **Auto Re-fetching**: Refetch on focus/reconnect
✅ **Optimistic Updates**: UI updates before server response
✅ **Type Safety**: Full TypeScript support (if using TS)
✅ **Dev Tools**: Redux DevTools integration

## 📝 Adding New Endpoints

To add new endpoints to `src/services/api.js`:

```javascript
export const api = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints
    
    // Add new endpoint
    getLabManual: builder.query({
      query: (sessionId) => `/lab-manuals/${sessionId}`,
      providesTags: (result, error, id) => [{ type: 'LabManual', id }],
    }),
  }),
});

// Export the hook
export const { useGetLabManualQuery } = api;
```

## 🔄 Cache Invalidation

RTK Query automatically invalidates cache using tags:

```javascript
// After creating a student, the student list is automatically refetched
createStudent: builder.mutation({
  invalidatesTags: ['Student'], // This refetches all Student queries
}),
```

## 💡 Best Practices

1. **Use hooks directly in components** - Don't wrap them unnecessarily
2. **Handle loading states** - Always show loading indicators
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Use optimistic updates** for better UX
5. **Keep endpoints organized** by feature

## 🌐 Backend Connection

Current configuration connects to:
- **Base URL**: `http://localhost:8080/elms/api`
- **Make sure your backend is running** on port 8080

## 🛠️ Next Steps

1. Start your backend: Java Spring Boot app on port 8080
2. Start your frontend: `npm run dev`
3. Use the example components or create your own
4. Test the API endpoints using the provided hooks

## 📚 Additional Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
