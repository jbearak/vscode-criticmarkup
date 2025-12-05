import * as vscode from 'vscode';
import * as os from 'os';

/**
 * Retrieves the author name for comment attribution
 * Returns null if disabled or unavailable
 * Always returns synchronously - never blocks
 * 
 * Priority order:
 * 1. Check criticmarkup.disableAuthorNames - if true, return null
 * 2. Check criticmarkup.authorName - if set, return this value
 * 3. Fallback to OS username from os.userInfo()
 * 4. Return null if all methods fail
 */
export function getAuthorName(): string | null {
	try {
		// Get configuration
		const config = vscode.workspace.getConfiguration('criticmarkup');
		
		// Priority 1: Check disable setting
		const disableAuthorNames = config.get<boolean>('disableAuthorNames', false);
		if (disableAuthorNames) {
			return null;
		}
		
		// Priority 2: Check author name setting
		const authorName = config.get<string>('authorName', '');
		if (authorName && authorName.trim() !== '') {
			return authorName;
		}
		
		// Priority 3: Fallback to OS username
		try {
			const userInfo = os.userInfo();
			if (userInfo.username && userInfo.username.trim() !== '') {
				return userInfo.username;
			}
		} catch {
			// Ignore errors
		}
		
		// Priority 4: All methods failed, return null
		return null;
	} catch (error) {
		// Fail fast - any error results in null
		return null;
	}
}
