# Security Specification: BailBridge / Namma Nyaya Agent

## Data Invariants
1. A Legal Case MUST be linked to a valid User UID.
2. Evidence MUST belong to a valid Case and inherit its access permissions.
3. Users cannot modify or spoof their own `userId` in other people's records.

## The Dirty Dozen (Test Payloads)
1. **Identity Spoof**: User A trying to write a case with `userId: UserB`. (Action: Create, Status: DENIED)
2. **Ghost Field**: Adding `isVerified: true` to a user profile. (Action: Update, Status: DENIED)
3. **Orphaned Evidence**: Uploading evidence to a case that doesn't exist. (Action: Create, Status: DENIED)
4. **ID Poisoning**: Using a 1MB string as a Case ID. (Action: Create, Status: DENIED)
5. **Cross-User Read**: User A trying to list cases where `userId == UserB`. (Action: List, Status: DENIED)
6. **Immutable Hijack**: Changing `createdAt` timestamp on an existing case. (Action: Update, Status: DENIED)
7. **Role Escalation**: Setting `role: 'admin'` in user profile. (Action: Create/Update, Status: DENIED)
8. **Malicious File Type**: Setting `fileType: 'exe'` in Evidence record. (Action: Create, Status: DENIED)
9. **Timestamp Spoof**: Providing a client-side `updatedAt` instead of server timestamp. (Action: Update, Status: DENIED)
10. **Case Deletion**: User B trying to delete User A's case. (Action: Delete, Status: DENIED)
11. **Hearing Manipulation**: Unauthorized user trying to add a hearing to a case. (Action: Create, Status: DENIED)
12. **PII Leak**: Unauthenticated user trying to get a specific user's email. (Action: Get, Status: DENIED)

## Red Team Results
| Collection | Identity Spoof | State Shortcut | Resource Poisoning |
|------------|----------------|----------------|-------------------|
| users      | PASS           | PASS           | PASS              |
| cases      | PASS           | PASS           | PASS              |
| evidence   | PASS           | PASS           | PASS              |
| hearings   | PASS           | PASS           | PASS              |
