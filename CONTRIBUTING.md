# 🤝 CONTRIBUTING.md

## How to Contribute

We love your input! We want to make contributing to Universal Remote App as easy and transparent as possible.

---

## Types of Contributions

### 🐛 Report Bugs
- Use GitHub Issues with the `bug` label
- Provide clear description of the issue
- Include steps to reproduce
- Specify device type and OS version

### ✨ Suggest Features
- Use GitHub Issues with the `enhancement` label
- Describe the use case
- Provide examples or mockups if possible
- Discuss implementation approach

### 🔧 Add Device Support
- Follow the [Device Integration Guide](./docs/DEVICE_INTEGRATION.md)
- Test thoroughly with real device
- Include documentation
- Add TypeScript interfaces
- Create example controls

### 📚 Improve Documentation
- Fix typos or clarify instructions
- Add examples and diagrams
- Update outdated information
- Translate guides to other languages

### 💻 Fix Bugs or Add Features
- Fork the repository
- Create a feature branch
- Follow code style guidelines
- Write/update tests
- Submit a pull request

---

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Xcode (iOS) or Android Studio (Android)
- GitHub account

### Step 1: Fork & Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/universal-remote-app.git
cd universal-remote-app
```

### Step 2: Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

### Step 3: Install Dependencies
```bash
npm install
cd ios && pod install && cd ..
```

### Step 4: Run Development Environment
```bash
npm run start
npm run ios  # In another terminal
```

---

## Code Guidelines

### TypeScript & React Native

✅ **DO**
- Use TypeScript for type safety
- Write functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Follow React Native best practices

❌ **DON'T**
- Use `any` type
- Commit console.logs or debug code
- Create very large components (> 300 lines)
- Mutate props or state directly
- Ignore TypeScript errors

### Code Style

```typescript
// ✅ Good
export const sendDeviceCommand = async (
  deviceId: string,
  command: Command
): Promise<void> => {
  // Implementation
};

// ❌ Bad
export const sendDeviceCommand = (deviceId, command) => {
  // Implementation
};
```

### Component Structure

```typescript
// Imports
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppDispatch } from '../hooks';

// Types
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

// Component
const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Hooks
  const [state, setState] = useState(false);
  
  // Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // Handlers
  const handlePress = () => {
    onPress();
  };

  // Render
  return (
    <View style={styles.container}>
      {title}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyComponent;
```

### Naming Conventions

```typescript
// Components: PascalCase
const RemoteButton = () => {};

// Functions/Variables: camelCase
const getDeviceStatus = () => {};
let activeDevice = null;

// Constants: UPPER_SNAKE_CASE
const MAX_COMMAND_TIMEOUT = 5000;
const NETWORK_BROADCAST_PORT = 1900;

// Interfaces: PascalCase with I prefix (optional)
interface IDevice {}
interface Device {} // or without I

// Files matching exports
// MyComponent.tsx -> exports MyComponent
// useMyHook.ts -> exports useMyHook
// deviceService.ts -> exports DeviceService
```

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Feature
git commit -m "feat(devices): add Yamaha receiver support"

# Bug fix
git commit -m "fix(control): fix gyroscope debouncing issue"

# Documentation
git commit -m "docs: update device integration guide"

# Style
git commit -m "style: format code with prettier"

# Tests
git commit -m "test(service): add device discovery tests"

# Refactor
git commit -m "refactor(adapter): simplify device adapter factory"
```

### Commit Message Template

```
feat(scope): Add new feature

Describe what the feature does and why it was needed.
Include any breaking changes or important details.

Fixes #123
Related to #456

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log or debug code
- [ ] Documentation is updated
- [ ] Commits are descriptive
- [ ] App runs on real device (if possible)

### Creating a PR

1. **Push your feature branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Link any related issues
   - Provide clear description
   - Include screenshots/videos if UI change
   - Request reviewers

3. **PR Description Template**
   ```markdown
   ## Description
   Briefly describe what this PR does.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Device support
   - [ ] Other

   ## Related Issues
   Fixes #123
   Related to #456

   ## Testing
   - [ ] Tested on iOS
   - [ ] Tested on Android
   - [ ] New tests added
   - [ ] Existing tests pass

   ## Checklist
   - [ ] Code follows style guide
   - [ ] No console.logs or debug code
   - [ ] Documentation updated
   - [ ] TypeScript compiles without errors
   ```

### Review Process

- At least one review required
- Address review comments
- Re-request review after changes
- Maintain conversation in PR thread

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test DeviceService.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    service = new DeviceService();
  });

  describe('sendCommand', () => {
    it('should throw error when device not connected', async () => {
      await expect(service.sendCommand('power_on')).rejects.toThrow(
        'Device not connected'
      );
    });

    it('should send command to connected device', async () => {
      // Setup
      const mockDevice = { id: 'test', type: 'soundbar' };
      
      // Act
      await service.connect(mockDevice);
      await service.sendCommand('power_on');
      
      // Assert
      // Verify command was sent
    });
  });
});
```

### Test Coverage

- Aim for >70% code coverage
- Test happy path and error cases
- Mock external dependencies
- Use descriptive test names

---

## Documentation Updates

### When to Update Docs

- Adding new feature
- Fixing a bug that's documented
- Clarifying confusing section
- Adding new device support
- Updating dependencies

### Documentation Files

- **README.md**: Overview, features, quick start
- **docs/SETUP.md**: Installation and environment setup
- **docs/ARCHITECTURE.md**: System design and data flow
- **docs/DEVICE_INTEGRATION.md**: Guide for adding devices
- **docs/DEVELOPER_GUIDE.md**: Code examples and development
- **CONTRIBUTING.md**: This file

### Documentation Style

- Use clear, simple language
- Include examples and code snippets
- Add diagrams for complex concepts
- Keep sections organized with headers
- Link to related sections

---

## Common Contribution Paths

### Path 1: Add Device Support

1. Read [DEVICE_INTEGRATION.md](./docs/DEVICE_INTEGRATION.md)
2. Research device API/protocol
3. Implement device adapter
4. Create control UI
5. Write tests
6. Submit PR with:
   - Device adapter implementation
   - Control component
   - Test coverage
   - Documentation update

### Path 2: Fix a Bug

1. Reproduce the issue
2. Find root cause
3. Implement minimal fix
4. Add regression test
5. Submit PR with:
   - Bug fix code
   - Test case
   - Description of fix

### Path 3: Improve Documentation

1. Identify unclear section
2. Update documentation
3. Add examples if needed
4. Submit PR with:
   - Documentation changes
   - Any code examples

### Path 4: Add New Feature

1. Open issue and discuss approach
2. Get approval from maintainers
3. Implement feature
4. Add tests
5. Update documentation
6. Submit PR with:
   - Feature implementation
   - Tests
   - Documentation updates

---

## Useful Resources

- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Git Guide](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Docs](https://docs.github.com/)

---

## Getting Help

### Questions?
- 📖 Check the [documentation](./docs)
- 💬 Open a [Discussion](https://github.com/itsmeshibintmz/universal-remote-app/discussions)
- 🐛 Look at [existing issues](https://github.com/itsmeshibintmz/universal-remote-app/issues)

### Need to Report Something?
- 🐛 **Bug**: Create [GitHub Issue](https://github.com/itsmeshibintmz/universal-remote-app/issues/new?template=bug_report.md)
- ✨ **Feature Request**: Create [GitHub Issue](https://github.com/itsmeshibintmz/universal-remote-app/issues/new?template=feature_request.md)
- 🙋 **Question**: Start a [Discussion](https://github.com/itsmeshibintmz/universal-remote-app/discussions)

---

## Code of Conduct

### Be Respectful
- Welcome diverse perspectives
- Be kind and supportive
- Respect others' time and effort

### Be Helpful
- Help others with their contributions
- Provide constructive feedback
- Share knowledge and resources

### Be Professional
- Use appropriate language
- Keep discussions on-topic
- Report harassment to maintainers

---

## Recognition

Contributors are recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing! 🙏

---

**Happy coding! 🚀**
