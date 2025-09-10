// API Client for Railway Backend
class APIClient {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.isOnline = false;
        this.init();
    }

    async init() {
        try {
            // Test API connection
            const response = await fetch(`${this.baseURL}/admins`);
            if (response.ok) {
                this.isOnline = true;
                console.log('✅ API connected successfully');
            } else {
                console.warn('⚠️ API not available, using localStorage');
            }
        } catch (error) {
            console.error('❌ API connection failed:', error);
            this.isOnline = false;
        }
    }

    // Generic API call method
    async apiCall(endpoint, method = 'GET', data = null) {
        if (!this.isOnline) {
            return this.getFromLocalStorage(endpoint);
        }

        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'API call failed');
            }

            return result;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            return this.getFromLocalStorage(endpoint);
        }
    }

    // Centers
    async getCenters() {
        return await this.apiCall('/centers');
    }

    async createCenter(center) {
        const result = await this.apiCall('/centers', 'POST', center);
        if (result.id) {
            this.saveToLocalStorage('centers', result);
        }
        return result;
    }

    // Students
    async getStudents() {
        return await this.apiCall('/students');
    }

    async createStudent(student) {
        const result = await this.apiCall('/students', 'POST', student);
        if (result.id) {
            this.saveToLocalStorage('students', result);
        }
        return result;
    }

    // Applications
    async getApplications() {
        return await this.apiCall('/applications');
    }

    async createApplication(application) {
        const result = await this.apiCall('/applications', 'POST', application);
        if (result.id) {
            this.saveToLocalStorage('applications', result);
        }
        return result;
    }

    // Marks
    async getMarks() {
        return await this.apiCall('/marks');
    }

    async createMark(mark) {
        const result = await this.apiCall('/marks', 'POST', mark);
        if (result.id) {
            this.saveToLocalStorage('marks', result);
        }
        return result;
    }

    // Admins
    async getAdmins() {
        return await this.apiCall('/admins');
    }

    // Authentication
    async adminLogin(email, password) {
        return await this.apiCall('/auth/admin', 'POST', { email, password });
    }

    async centerLogin(email, password) {
        return await this.apiCall('/auth/center', 'POST', { email, password });
    }

    async studentLogin(registrationId, dateOfBirth) {
        return await this.apiCall('/auth/student', 'POST', { registration_id: registrationId, date_of_birth: dateOfBirth });
    }

    // Local Storage fallback methods
    getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    saveToLocalStorage(key, item) {
        const data = this.getFromLocalStorage(key);
        data.push(item);
        localStorage.setItem(key, JSON.stringify(data));
        return item;
    }
}

// Create global API client instance
const api = new APIClient();
window.api = api;
