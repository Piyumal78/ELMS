# 🔐 Complete Authentication System - Sinhala Guide

## ✅ හදපු දේවල්

### 1. **Login/Activate Page** (`/signup`)
- SignUp page එකම update කරලා තියෙනවා
- Login සහ Account Activation දෙකටම use කරන්න පුළුවන්
- "First time? Activate Your Account" link එක click කරලා activate mode එකට යන්න පුළුවන්

### 2. **Token Storage**
Token එක **2 තැන්**හි save වෙනවා:
- ✅ Redux store එකේ (memory)
- ✅ localStorage එකේ (browser refresh කළත් තියෙනවා)

### 3. **Protected Routes**
හැම route එකම දැන් protect කරලා තියෙනවා:
- Student routes - Student විතරක් access කරන්න පුළුවන්
- Staff routes - Staff විතරක් access කරන්න පුළුවන්
- Token නැතිනම් auto redirect වෙනවා login page එකට

### 4. **Logout Functionality**
Student navbar එකේ logout button එක add කරලා තියෙනවා

---

## 📋 සම්පූර්ණ Authentication Flow

### Step 1: **Account Activation** (පලවෙනි වතාව)

1. `/signup` page එකට යන්න
2. "First time? Activate Your Account" link එක click කරන්න
3. Registration number සහ password enter කරන්න
4. "Activate Account" button එක click කරන්න
5. Success message එකක් එනවා

```
Registration Number: EC/2021/002
Password: student123
```

### Step 2: **Login** (Activate කරපු පස්සේ)

1. "Already activated? Sign In" link එක click කරන්න
2. Role select කරන්න (Student/Staff)
3. Registration number සහ password enter කරන්න
4. "Sign In" button එක click කරන්න
5. **Token auto save වෙනවා** Redux සහ localStorage එකේ
6. Role එකට අනුව auto redirect වෙනවා:
   - Student → `/student` page එකට
   - Staff → `/dashboard` page එකට

### Step 3: **Protected Access** (Login කරපු පස්සේ)

Token එක save වෙලා තියෙනකොට:
- ✅ Student විතරක් `/student`, `/lab1`, `/lab2`, etc access කරන්න පුළුවන්
- ✅ Staff විතරක් `/dashboard`, `/inventory`, etc access කරන්න පුළුවන්
- ✅ Token නැතිනම් auto redirect වෙනවා `/signup` page එකට
- ✅ Wrong role එකක් තිබුනත් redirect වෙනවා correct page එකට

### Step 4: **Logout**

1. Student navbar එකේ profile dropdown එක open කරන්න
2. "Sign Out" button එක click කරන්න
3. Token එක auto delete වෙනවා
4. Login page එකට redirect වෙනවා

---

## 🎯 Token කොහොමද Store වෙන්නේ?

### Login වෙන වෙලාවේ:

```javascript
// 1. Login API call එක යනවා
const result = await login({username, password}).unwrap();

// 2. Token එක response එකේ එනවා
// result = { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

// 3. Redux එකේ save කරනවා
dispatch(setCredentials({ 
  token: result.token, 
  user: { username, role, staffRole } 
}));

// 4. Auto localStorage එකේත් save වෙනවා
localStorage.setItem('token', result.token);
localStorage.setItem('user', JSON.stringify(user));
```

### API Calls වෙනකොට:

```javascript
// RTK Query auto token එක add කරනවා හැම request එකටම
headers.set('Authorization', `Bearer ${token}`);
```

### Logout වෙනකොට:

```javascript
// 1. Redux state එකෙන් clear කරනවා
dispatch(logout());

// 2. localStorage එකෙන්ත් delete කරනවා
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## 🔒 Protected Routes කොහොමද වැඩ කරන්නේ?

### StudentRoute Component එක:

```javascript
// Token එක check කරනවා
if (!token) {
  return <Navigate to="/signup" />; // Login page එකට යවනවා
}

// Role එක check කරනවා
if (user?.role !== 'student') {
  return <Navigate to="/dashboard" />; // Wrong page එකට නම් redirect කරනවා
}

// හරි නම් page එක show කරනවා
return children;
```

### Usage:

```jsx
<Route path='/student' element={
  <StudentRoute>
    <Student />
  </StudentRoute>
} />
```

---

## 📱 Components

### 1. **SignUpForm.jsx** (Updated)
- Login සහ Activate දෙකටම use කරන්න පුළුවන්
- RTK Query hooks use කරනවා (`useLoginMutation`, `useActivateAccountMutation`)
- Token auto save කරනවා
- Role-based redirect කරනවා

### 2. **ProtectedRoute.jsx** (New)
- `ProtectedRoute` - Token එක check කරනවා
- `StudentRoute` - Student විතරක් access කරන්න පුළුවන්
- `StaffRoute` - Staff විතරක් access කරන්න පුළුවන්
- `AdminRoute` - Admin විතරක් access කරන්න පුළුවන්

### 3. **UserProfile.jsx** (New)
- User details show කරනවා
- Logout button එක තියෙනවා

### 4. **StudentNavbar.jsx** (Updated)
- User ගේ username show කරනවා
- Logout functionality add කරලා තියෙනවා
- Redux state එකෙන් user data ගන්නවා

---

## 🚀 Test කරන විදිහ

### 1. Backend Run කරන්න:
```bash
cd elms
.\mvnw.cmd spring-boot:run
```

### 2. Frontend Run කරන්න:
```bash
cd homecomponent
npm run dev
```

### 3. Admin Account එකක් Create කරන්න (Backend console එකේ auto create වෙනවා)

### 4. Student Account එකක් Create කරන්න:
- Postman use කරලා admin token එක ගන්න
- `/api/students` endpoint එකට POST request එකක් යවන්න
- Student registration number create වෙනවා (password එක නැතිව)

### 5. Student Account Activate කරන්න:
- `/signup` page එකට යන්න
- "Activate Account" mode එකට switch කරන්න
- Registration number සහ password enter කරන්න
- Activate button එක click කරන්න

### 6. Login කරන්න:
- Login mode එකට switch කරන්න
- Registration number සහ password enter කරන්න
- Auto redirect වෙනවා `/student` page එකට

### 7. Protected Routes Test කරන්න:
- Token එක තියෙනකොට `/student` access කරන්න - ✅ Work වෙනවා
- Logout කරලා `/student` access කරන්න - ❌ Redirect වෙනවා `/signup` එකට

---

## 💡 Important Notes

### Token Expiry:
- දැනට token expiry handle කරලා නෑ
- Backend එකෙන් token expire වෙන වෙලාව set කරන්න පුළුවන්
- Expire වෙනකොට error එකක් එනවා, ඒකෙන් logout කරන්න පුළුවන්

### Security:
- ✅ Token එක localStorage එකේ save වෙනවා
- ✅ HTTPS use කරන්න production එකේ
- ✅ Token එක auto add වෙනවා හැම API call එකටම

### Browser Refresh:
- ✅ Token එක localStorage එකේ තියෙනවා
- ✅ Page refresh කළත් login state එක තියෙනවා
- ✅ Redux store එකත් localStorage එකෙන් initialize වෙනවා

---

## 🎨 Customization

### Different Roles වලට Different Pages:

```jsx
// App.jsx එකේ
<Route path='/student' element={
  <StudentRoute>
    <Student />
  </StudentRoute>
} />

<Route path='/dashboard' element={
  <StaffRoute>
    <Dashboard />
  </StaffRoute>
} />
```

### Token Access කරන විදිහ Components එකේ:

```jsx
import { useSelector } from 'react-redux';

function MyComponent() {
  const { token, user } = useSelector((state) => state.auth);
  
  return (
    <div>
      <p>Logged in as: {user?.username}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

---

## ✅ Summary

1. ✅ **SignUp page එක use කරලා** login සහ activate කරන්න පුළුවන්
2. ✅ **Token auto save වෙනවා** Redux සහ localStorage එකේ
3. ✅ **Protected routes working** - Student විතරක් student pages access කරන්න පුළුවන්
4. ✅ **Logout working** - Token delete වෙලා login page එකට redirect වෙනවා
5. ✅ **Auto redirect** - Role එකට අනුව correct page එකට යනවා

සම්පූර්ණ authentication system එක ready! 🎉
