# github-actions-practice

A MERN-style project using Bun runtime and TypeScript, with GitHub Actions CI/CD pipeline.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Run tests
bun test

# Type checking
bun run type-check

# Build for production
bun run build

# Start production server
bun start
```


# 1. Project Structure & Tech Stack

- Framework: Express.js, Next.js, NestJS, etc.
- Database: MongoDB, PostgreSQL, MySQL, etc.
- ORM/ODM: Mongoose, Prisma, TypeORM, etc.
- Testing tools you're using: Jest, Mocha, Bun test, etc.

# 2. API/Function Details
## Endpoint: GET /api/users/profile
- Method: GET
- URL: /api/users/profile
- Auth required: Yes (Bearer token)
- Headers: { Authorization: "Bearer <token>" }
- Response format: JSON
- Success response (200): { "success": true, "data": { user: {...} } }
- Error response (401): { "success": false, "error": "Unauthorized" }
- Database query: finds user by ID from token

# 3. Code to Test (The Actual Implementation)

// Share the actual route/function code
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

# 4. Test Scenario Requirements

## What needs to be tested:
1. ✅ Valid token returns user profile
2. ❌ Invalid token returns 401
3. ❌ Missing token returns 401
4. ✅ Password is excluded from response
5. ❌ Non-existent user returns 404
6. ❌ Database error returns 500

