# Exercise Image/GIF Options - Research & Testing

## Date: October 21, 2025

## Problem
- External CDN URLs (inspireusafoundation.org) returning 404 errors
- Need reliable alternative for exercise demonstration images/GIFs

## Tested Options

### ✅ Option 1: Giphy (WORKS)
**Status:** ✅ Working (200 OK)
**Test URL:** `https://media.giphy.com/media/3o7btNhMBytxAM6YBa/giphy.gif`

**Pros:**
- Free, reliable CDN
- Large library of fitness GIFs
- Direct image URLs (no API key needed)
- Fast loading
- HTTPS secure

**Cons:**
- Need to find appropriate exercise GIFs manually
- Quality may vary
- Some GIFs may have watermarks

**How to use:**
1. Search Giphy.com for exercise (e.g., "squat exercise", "push up")
2. Right-click GIF → Copy Image Address
3. Use the direct media.giphy.com URL

**Example URLs to test:**
- Squats: `https://media.giphy.com/media/1qfDmQQGSD2RstDWms/giphy.gif`
- Push-ups: `https://media.giphy.com/media/3o7btNhMBytxAM6YBa/giphy.gif`
- Running: `https://media.giphy.com/media/xT5LMHRvCejDEIHPmU/giphy.gif`

---

### ❌ Option 2: Free Exercise DB (GitHub)
**Status:** ❌ Failed (404)
**Test URL:** `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/bodyweight_squats/images/0.jpg`

**Issue:** Repository structure doesn't match expected paths

---

### ❌ Option 3: ExerciseDB API (RapidAPI)
**Status:** ❌ Requires API key (403 Forbidden)

**Pros:**
- Professional exercise database
- Standardized format

**Cons:**
- Requires API key registration
- Rate limits on free tier
- More complex implementation

---

### 💡 Option 4: Local Images (RECOMMENDED FOR PRODUCTION)
**Status:** Not tested yet, but most reliable

**Pros:**
- Complete control
- No external dependencies
- No 404 errors
- Offline support (PWA)
- Fastest loading

**Cons:**
- Need to source/create images
- Increases bundle size
- Manual upload required

**Implementation:**
1. Create `public/exercises/` folder
2. Add GIF/images for each exercise
3. Reference as `/HMI/exercises/exercise-name.gif`
4. Works with GitHub Pages deployment

---

## Recommendations

### Short-term (Immediate Fix):
**Use Giphy CDN** - It's working, free, and has good coverage

### Medium-term (Better UX):
**Local images in public folder**
- Better for PWA offline support
- More reliable
- Can use optimized WebP format

### Long-term (Best Solution):
**Combination approach:**
1. Local images for core exercises (always available)
2. Optional: Link to YouTube videos for detailed tutorials
3. Fallback to emoji + instructions (already implemented)

---

## Implementation Plan

### Phase 1: Quick Fix with Giphy (Today)
1. Find appropriate Giphy GIFs for each exercise
2. Test 2-3 exercises with Giphy URLs
3. Verify they load in the app
4. If working, add URLs for remaining exercises

### Phase 2: Local Images (Future)
1. Source or create proper exercise GIFs/images
2. Optimize for web (compress, convert to WebP)
3. Add to `public/exercises/` folder
4. Update exercise data files
5. Test offline functionality

---

## Test Exercise GIFs from Giphy

Here are some Giphy URLs to test first:

```typescript
// Main Exercises
{
  name: 'Free Squats',
  imageUrl: 'https://media.giphy.com/media/1qfDmQQGSD2RstDWms/giphy.gif'
}

{
  name: 'Push Ups',
  imageUrl: 'https://media.giphy.com/media/3o7btNhMBytxAM6YBa/giphy.gif'
}

{
  name: 'Jogging',
  imageUrl: 'https://media.giphy.com/media/xT5LMHRvCejDEIHPmU/giphy.gif'
}

// Warmup
{
  name: 'High Knees',
  imageUrl: 'https://media.giphy.com/media/HtBPH65zVLfos/giphy.gif'
}
```

---

## Next Steps

1. ✅ Confirm Giphy works in browser (not just curl)
2. ⏳ Test Giphy GIFs in actual ActiveWorkout component
3. ⏳ Search Giphy for remaining exercises
4. ⏳ Update exercise data files if tests pass
5. ⏳ Consider local image approach for production

---

## Decision Criteria

Choose Giphy if:
- Need quick solution
- Want animated GIFs
- OK with external dependency

Choose Local Images if:
- Want full control
- Need offline support
- Have time to source images
- Building for production
