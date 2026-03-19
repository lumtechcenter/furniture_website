// Supabase Configuration for SLZ GLOBAL Furniture Store
const SUPABASE_URL = "https://wlwuntefesaxpzmjzend.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsd3VudGVmZXNheHB6bWp6ZW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzE5MDMsImV4cCI6MjA4OTQwNzkwM30.zpfHSJ0Tz8b95mZEiDBHCv5rUPzCAw2bxOal2vunfTU";

// Initialize Supabase Client
const { createClient } = supabase;
const sbClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin Email for receiving orders
const ADMIN_EMAIL = "your-admin-email@example.com"; // Change this to your email

// JWT Token Management
const TOKEN_KEY = 'slz_admin_token';

function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
}

// Simple JWT creation (for demo - in production use server-side)
function createToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        user: user,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('slz_secret_' + user + Date.now());
    return `${header}.${payload}.${signature}`;
}

// Format currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}
