export const firebaseData = {
  users: {
    userId1: {
      name: "John Doe",
      email: "johndoe@example.com",
      settings: {
        theme: "vs-dark"
      },
      lastActiveFile: "fileId1",
      editorState: {
        cursorPosition: { line: 10, column: 5 },
        scrollPosition: { top: 100, left: 0 },
        splitSizes: [50, 50],
      },
    },
    userId2: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      settings: {
        theme: "light"
      },
      lastActiveFile: "fileId3",
      editorState: {
        cursorPosition: { line: 5, column: 20 },
        scrollPosition: { top: 50, left: 10 },
        splitSizes: [30, 70],
      },
    },
  },
  files: {
    fileId1: {
      userId: "userId1",
      sourceCode: "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
      languageId: "54",
      fileName: "main.cpp",
      createdAt: "2025-01-15T12:00:00Z",
      updatedAt: "2025-01-16T12:00:00Z",
    },
    fileId2: {
      userId: "userId1",
      sourceCode: "console.log('Hello, World!');",
      languageId: "63",
      fileName: "app.js",
      createdAt: "2025-01-15T15:00:00Z",
      updatedAt: "2025-01-16T13:00:00Z",
    },
    fileId3: {
      userId: "userId2",
      sourceCode: "print('Hello from Python!')",
      languageId: "71",
      fileName: "hello.py",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T11:00:00Z",
    },
    fileId4: {
      userId: "userId2",
      sourceCode: "SELECT * FROM users WHERE active = true;",
      languageId: "42",
      fileName: "query.sql",
      createdAt: "2025-01-14T09:30:00Z",
      updatedAt: "2025-01-15T14:30:00Z",
    },
  },
};
