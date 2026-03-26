# GBS App Theme Colors & Design System

## 🎨 Primary Brand Colors

### Red (Primary Brand Color)
```css
/* Tailwind Classes */
bg-red-600        /* Header backgrounds, primary buttons */
text-red-600      /* Primary text, links */
border-red-500    /* Active borders, focus states */
bg-red-100        /* Light red backgrounds, badges */
text-red-500      /* Muted red text */
border-red-500    /* Red borders */

/* Hex Values */
#DC2626          /* Deep red (headers) */
#e53935          /* Standard red (buttons, links) */
#ef4444          /* Primary red (defined in tailwind.config) */
```

## 🔵 Secondary Colors

### Blue
```css
/* Tailwind Classes */
bg-blue-500        /* Blue backgrounds */
text-blue-600      /* Blue text */
border-blue-500    /* Blue borders */
bg-blue-100        /* Light blue backgrounds */

/* Hex Values */
#3B82F6          /* Standard blue */
```

### Green
```css
/* Tailwind Classes */
bg-green-500       /* Green backgrounds */
text-green-600     /* Green text */
border-green-500   /* Green borders */
bg-green-100       /* Light green backgrounds */

/* Hex Values */
#10B981          /* Standard green */
```

## ⚪ Neutral Colors

### Gray Scale
```css
/* Tailwind Classes */
bg-gray-50        /* Main app background */
bg-gray-100       /* Card backgrounds, light sections */
bg-gray-200       /* Disabled buttons, separators */
bg-gray-500       /* Dark gray elements */
text-gray-500      /* Secondary text */
text-gray-600      /* Body text */
text-gray-700      /* Darker body text */
text-gray-800      /* Section headings */
text-gray-900      /* Important text */
border-gray-200    /* Light borders */
border-gray-500    /* Standard borders */

/* Hex Values */
#F9FAFB          /* bg-gray-50 */
#F3F4F6          /* bg-gray-100 */
#E5E7EB          /* bg-gray-200 */
#6B7280          /* bg-gray-500 */
#6B7280          /* text-gray-500 */
#4B5563          /* text-gray-600 */
#374151          /* text-gray-700 */
#1F2937          /* text-gray-800 */
#111827          /* text-gray-900 */
#E5E7EB          /* border-gray-200 */
#6B7280          /* border-gray-500 */
```

### Black & White
```css
/* Tailwind Classes */
bg-white           /* Card backgrounds, modal backgrounds */
text-white         /* White text on dark backgrounds */
bg-black           /* Black backgrounds (rare) */
text-black         /* Black text */

/* Hex Values */
#FFFFFF           /* White */
#000000           /* Black */
```

## 🎯 Color Usage Guidelines

### Primary Actions (Red)
- **Headers**: `bg-red-600` + `text-white`
- **Primary Buttons**: `bg-red-600` + `text-white`
- **Active States**: `border-red-500`
- **Important Links**: `text-red-600`
- **Error States**: `text-red-600`

### Secondary Actions (Blue)
- **Secondary Buttons**: `bg-blue-500` + `text-white`
- **Links**: `text-blue-600`
- **Info Elements**: `bg-blue-100`

### Success States (Green)
- **Success Messages**: `text-green-600`
- **Success Backgrounds**: `bg-green-100`
- **Success Buttons**: `bg-green-500` + `text-white`

### Backgrounds & Surfaces
- **Main App**: `bg-gray-50`
- **Cards**: `bg-white`
- **Modals**: `bg-white`
- **Light Sections**: `bg-gray-100`

### Text Hierarchy
- **Headings**: `text-gray-900` (largest)
- **Subheadings**: `text-gray-800`
- **Body Text**: `text-gray-600`
- **Secondary Text**: `text-gray-500`
- **Disabled Text**: `text-gray-400`

### Borders & Dividers
- **Standard Borders**: `border-gray-200`
- **Active Borders**: `border-red-500`
- **Focus States**: `border-blue-500`

## 🎨 Component Color Patterns

### Header Pattern
```jsx
<View style={tw`bg-red-600 px-5 pt-12 pb-8`}>
  <Text style={tw`text-white text-2xl font-bold`}>
    Header Title
  </Text>
</View>
```

### Card Pattern
```jsx
<View style={tw`bg-white rounded-2xl p-5 shadow-sm border border-gray-200`}>
  <Text style={tw`text-gray-900 text-lg font-semibold mb-3`}>
    Card Title
  </Text>
  <Text style={tw`text-gray-600 text-sm`}>
    Card content
  </Text>
</View>
```

### Button Pattern
```jsx
{/* Primary Button */}
<TouchableOpacity style={tw`bg-red-600 rounded-xl p-4`}>
  <Text style={tw`text-white font-semibold text-center`}>
    Primary Action
  </Text>
</TouchableOpacity>

{/* Secondary Button */}
<TouchableOpacity style={tw`bg-blue-500 rounded-xl p-4`}>
  <Text style={tw`text-white font-semibold text-center`}>
    Secondary Action
  </Text>
</TouchableOpacity>

{/* Disabled Button */}
<TouchableOpacity 
  style={tw`bg-gray-200 rounded-xl p-4`}
  disabled={true}
>
  <Text style={tw`text-gray-500 font-semibold text-center`}>
    Disabled
  </Text>
</TouchableOpacity>
```

### Input Pattern
```jsx
<TextInput
  style={tw`bg-white border border-gray-200 rounded-lg p-4 text-gray-800`}
  placeholderTextColor={tw.color('text-gray-500')}
/>
```

## 🎯 Theme Configuration

### Tailwind Config (tailwind.config.js)
```javascript
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EF4444", // GBS Red
        secondary: "#FFFFFF", // White
      },
    },
  },
  plugins: [],
};
```

## 📱 Color Accessibility

### Contrast Ratios
- **Red on White**: 4.5:1 ✅ (WCAG AA compliant)
- **Red on Gray**: 3.2:1 ⚠️ (Needs improvement)
- **Blue on White**: 4.6:1 ✅ (WCAG AA compliant)
- **Green on White**: 3.8:1 ⚠️ (Needs improvement)

### Usage Guidelines
- Use high contrast colors for important text
- Ensure sufficient color differentiation
- Test with accessibility tools
- Consider color blindness (red/green blindness)

## 🚀 Implementation Notes

### Consistent Usage
1. **Use semantic color names** (primary, secondary)
2. **Maintain contrast ratios** for accessibility
3. **Use gray scale** for neutral elements
4. **Reserve red** for primary actions only
5. **Use blue/green** for secondary/success states

### Dynamic Colors
```javascript
// For dynamic theming (if needed)
const Colors = {
  primary: '#EF4444',
  secondary: '#FFFFFF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#10B981',
};
```

## 📋 Quick Reference

### Most Used Colors
| Purpose | Tailwind Class | Hex | Usage |
|---------|---------------|-----|-------|
| Primary Red | `bg-red-600` | #DC2626 | Headers, primary buttons |
| Standard Red | `text-red-600` | #DC2626 | Links, important text |
| Light Red | `bg-red-100` | #FEE2E2 | Badges, highlights |
| Blue | `text-blue-600` | #2563EB | Secondary links |
| Light Blue | `bg-blue-100` | #DBEAFE | Info backgrounds |
| Green | `text-green-600` | #059669 | Success states |
| Light Green | `bg-green-100` | #D1FAE5 | Success backgrounds |
| White | `bg-white` | #FFFFFF | Cards, modals |
| Light Gray | `bg-gray-50` | #F9FAFB | Main background |
| Medium Gray | `text-gray-600` | #4B5563 | Body text |
| Dark Gray | `text-gray-900` | #111827 | Headings |

This theme system ensures consistent branding across your GBS app while maintaining accessibility standards.
