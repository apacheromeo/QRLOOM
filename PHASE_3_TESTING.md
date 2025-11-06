# Phase 3 Testing Guide

This guide will help you test all the Dashboard and QR Management features.

## Prerequisites

Before testing Phase 3, ensure:
1. ✅ Supabase migration has been run
2. ✅ Environment variables are set in .env.local and Vercel
3. ✅ Application is deployed to Vercel

## Test Scenarios

### 1. Authentication Setup (Required First)

**Test: Sign Up & Sign In**
1. Go to `/auth/signup`
2. Create a new account with email and password
3. After signup, you should be redirected to `/dashboard`
4. Note: This creates a profile in the `profiles` table automatically

Expected Result:
- ✅ User created in Supabase `auth.users`
- ✅ Profile created in `profiles` table
- ✅ Redirected to dashboard
- ✅ Header shows "Dashboard" and "My QR Codes" links

---

### 2. Dashboard Page (`/dashboard`)

**Test: View Dashboard Statistics**

Navigate to `/dashboard` (must be signed in)

Expected to see:
- ✅ Welcome message with your name/email
- ✅ Plan badge (Free Plan or Pro Plan)
- ✅ 4 Statistics cards:
  - Total QR Codes: "0 / 10" (for free plan)
  - Total Scans: "0"
  - Scans This Month: "0 / 1000"
  - Active Codes: "0"
- ✅ "Recent QR Codes" section (empty state with "Create Your First QR Code" button)
- ✅ "Recent Scans" section (empty state)
- ✅ "Quick Actions" section with 4 buttons

**Test: Free Plan Limits**
- Check that statistics show:
  - "0 / 10" for Total QR Codes (10 is the limit)
  - "1000 remaining" for Scans This Month

---

### 3. Create QR Codes (from Home Page)

**Test: Create and Save QR Code**

1. Go to home page `/` (or click "Create QR Code" from dashboard)
2. Enter a URL: `https://example.com`
3. Customize:
   - Choose colors (e.g., black foreground, white background)
   - Select format: PNG
   - Add a title in your browser console or wait for save feature
4. The QR code should generate in real-time

Expected Result:
- ✅ QR code preview updates immediately
- ✅ Download button works

**Note:** The current home page QR generator doesn't have a "Save" button yet. To test saving, we need to either:
- Option A: Manually insert a QR code via Supabase dashboard
- Option B: Use the API directly

Let me create a test QR code via API for you:

---

### 4. Test Creating QR Codes via API

Use this curl command (replace with your auth token):

```bash
# First, get your auth session from browser DevTools > Application > Cookies
# Look for sb-*-auth-token cookie

curl -X POST https://your-app.vercel.app/api/qr/save \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "dataUrl": "https://example.com",
    "title": "Example Website",
    "description": "My first QR code",
    "format": "png",
    "foregroundColor": "#000000",
    "backgroundColor": "#FFFFFF"
  }'
```

Or insert directly in Supabase:

```sql
-- In Supabase SQL Editor
INSERT INTO qrcodes (
  user_id,
  data_url,
  short_code,
  title,
  description,
  format,
  foreground_color,
  background_color,
  status
) VALUES (
  'YOUR_USER_ID', -- Get from auth.users table
  'https://example.com',
  'test123456',
  'Test QR Code',
  'Testing Phase 3',
  'png',
  '#000000',
  '#FFFFFF',
  'active'
);
```

---

### 5. QR Codes List Page (`/qr-codes`)

**Test: View QR Codes List**

After creating QR codes, go to `/qr-codes`

Expected to see:
- ✅ Page header "My QR Codes"
- ✅ "Create QR Code" button
- ✅ Search bar
- ✅ Status filter dropdown (All Status, Active, Archived, Deleted)
- ✅ Sort dropdown (Newest First, Most Scans, Title A-Z)
- ✅ View toggle buttons (Grid/List view)
- ✅ QR code cards showing:
  - QR code preview (colored square)
  - Title
  - URL
  - Scan count
  - Creation date
  - Status badge (if archived)
  - "View Details" button
  - External link button

**Test: Search Functionality**
1. Type in search bar: "Example"
2. List should filter to show only QR codes matching "Example"
3. Clear search to see all QR codes again

**Test: Filter by Status**
1. Select "Active" from status dropdown
2. Should show only active QR codes
3. Select "Archived"
4. Should show only archived QR codes (empty if none archived yet)

**Test: Sort Options**
1. Select "Most Scans" from sort dropdown
2. QR codes should reorder by scan count
3. Select "Title A-Z"
4. QR codes should reorder alphabetically

**Test: View Toggle**
1. Click Grid icon - should show cards in grid layout
2. Click List icon - should show cards in list layout

**Test: Pagination**
(Only visible if you have more than 12 QR codes)
1. Create more than 12 QR codes
2. Should see "Previous" and "Next" buttons
3. Click "Next" to see page 2

---

### 6. QR Code Detail Page (`/qr-codes/[id]`)

**Test: View QR Code Details**

1. From QR codes list, click "View Details" on a QR code
2. Should navigate to `/qr-codes/[id]`

Expected to see:
- ✅ Back button (arrow) to return to list
- ✅ QR code title as page heading
- ✅ "Created X ago" subtitle
- ✅ Action dropdown menu (three dots)
- ✅ 3 Statistics cards:
  - Total Scans
  - Created date
  - Status
- ✅ QR Code Preview section with:
  - Live QR code preview
  - Short URL input field
  - Copy button
  - "Share this short URL to track scans" message
- ✅ Details section with:
  - Title (editable)
  - Description (editable)
  - Destination URL (read-only)
  - Short Code (read-only)
  - Format (read-only)
  - Color swatches
- ✅ Analytics placeholder section

**Test: Edit QR Code**
1. Click "Edit" button in Details section
2. Title and Description fields become editable
3. Change the title to "Updated Title"
4. Change description to "Updated description"
5. Click "Save" button
6. Should see success toast: "Saved! QR code updated successfully"
7. Verify changes are saved (refresh page)

**Test: Copy Short URL**
1. Click the Copy button (📋 icon) next to short URL
2. Should see toast: "Copied! Short URL copied to clipboard"
3. Paste somewhere to verify: should be like `https://your-app.vercel.app/r/test123456`

---

### 7. QR Code Actions Menu

**Test: Actions Dropdown**
1. Click the three dots (⋮) button
2. Dropdown menu should appear with options:
   - Edit
   - Copy Link
   - Open Link
   - Archive (or Unarchive if already archived)
   - Delete (in red)

**Test: Archive QR Code**
1. Click "Archive" from dropdown
2. Should see toast: "Archived! QR code moved to archive"
3. Card should now show yellow "Archived" badge
4. Click three dots again
5. Should now see "Unarchive" option
6. Click "Unarchive"
7. Should see toast: "Unarchived! QR code restored"
8. Badge should disappear

**Test: Delete QR Code**
1. Click "Delete" from dropdown (red option)
2. Confirmation dialog appears:
   - Title: "Are you sure?"
   - Message: "This action cannot be undone..."
   - "Cancel" button
   - "Delete" button (red)
3. Click "Cancel" - dialog closes, nothing happens
4. Click three dots again, click "Delete"
5. Click "Delete" button in dialog
6. Should see toast: "Deleted! QR code has been deleted"
7. Should redirect back to `/qr-codes`
8. QR code should no longer appear in list (soft deleted, status='deleted')

---

### 8. Dashboard with Data

**Test: Dashboard Updates with QR Codes**

After creating several QR codes:
1. Go back to `/dashboard`
2. Statistics should update:
   - Total QR Codes: "3 / 10" (if you created 3)
   - Active Codes: "3"
3. "Recent QR Codes" section shows last 5 QR codes created
4. Each recent QR card shows:
   - Title (clickable link to detail page)
   - URL
   - Scan count
   - "X ago" timestamp
   - External link button

---

### 9. Plan Limits Testing

**Test: Free Plan QR Code Limit**

Create 10 QR codes (free plan limit), then try to create 11th:

```bash
# Use the save API 11 times
# The 11th attempt should fail
```

Expected Result:
- First 10 QR codes save successfully
- 11th attempt returns error:
  ```json
  {
    "error": "QR code limit reached. Upgrade to Pro for unlimited QR codes.",
    "limit": 10,
    "current": 10
  }
  ```

**Test: Upgrade Message**
1. Dashboard should show "Upgrade to Pro" button
2. Statistics show plan limits clearly

---

### 10. Navigation Testing

**Test: Header Navigation**
1. Header should always show:
   - "QRLoom" logo (links to home)
   - "Dashboard" link (when signed in)
   - "My QR Codes" link (when signed in)
   - "Sign Out" button (when signed in)
2. Click each link to verify navigation works
3. Click "Sign Out"
4. Should redirect to home page
5. Header should now show "Sign In" and "Sign Up" buttons

---

## Common Issues & Solutions

### Issue 1: "Unauthorized" Error
**Solution:** Make sure you're signed in. Check browser DevTools > Application > Local Storage for auth data.

### Issue 2: No QR codes showing
**Solution:**
1. Check Supabase Table Editor > qrcodes table
2. Verify user_id matches your auth.users id
3. Check status is 'active'

### Issue 3: Statistics showing 0
**Solution:**
1. Verify qrcodes table has data
2. Check that user_id column matches your user
3. Refresh the page

### Issue 4: Can't create QR codes
**Solution:**
1. Phase 3 doesn't modify the home page QR generator
2. Use Supabase SQL Editor to insert test data
3. Or wait for the save functionality (could be added as enhancement)

---

## Database Verification

Check your Supabase tables:

### `profiles` table:
```sql
SELECT * FROM profiles;
```
Should show your user profile with plan='free'

### `qrcodes` table:
```sql
SELECT id, title, short_code, scan_count, status, created_at
FROM qrcodes
ORDER BY created_at DESC;
```

### `scans` table:
```sql
SELECT * FROM scans;
```
(Will be empty until Phase 4 tracking is implemented)

---

## Success Criteria

Phase 3 is working correctly if:
- ✅ Dashboard displays user statistics
- ✅ QR codes list shows all user's QR codes
- ✅ Search and filters work correctly
- ✅ Can view QR code details
- ✅ Can edit QR code title and description
- ✅ Can archive/unarchive QR codes
- ✅ Can delete QR codes with confirmation
- ✅ Copy URL functionality works
- ✅ Navigation between pages works smoothly
- ✅ Toast notifications appear for all actions
- ✅ Free plan limits are enforced
- ✅ All pages require authentication

---

## Next Steps

Once Phase 3 is verified:
- **Phase 4**: Add analytics tracking (scan location, device data, charts)
- **Enhancement**: Add "Save QR Code" button to home page generator
- **Enhancement**: Bulk operations (delete multiple QR codes)
- **Enhancement**: Export QR codes list to CSV

---

Need help testing? Let me know which part you'd like to focus on!
