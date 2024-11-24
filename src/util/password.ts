export default function generateRandomPassword(length = 8) {
    if (length < 8) {
      throw new Error('Password length must be at least 8 characters.');
    }
  
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = lowerCase + upperCase + specialChars;
  
    let password = '';
  
    // Ensure at least one character from each required set
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
    // Add remaining characters randomly from all available characters
    while (password.length < length) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  }