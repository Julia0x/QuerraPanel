const axios = require('axios');

class PterodactylService {
  constructor() {
    this.apiUrl = process.env.PTERODACTYL_API_URL;
    this.apiKey = process.env.PTERODACTYL_API_KEY;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }

  async createUser({ email, username, password }) {
    try {
      const response = await this.client.post('/api/application/users', {
        email,
        username,
        first_name: username,
        last_name: 'User',
        password,
        root_admin: false,
        language: 'en'
      });

      return {
        id: response.data.attributes.id,
        uuid: response.data.attributes.uuid,
        username: response.data.attributes.username,
        email: response.data.attributes.email
      };
    } catch (error) {
      console.error('Pterodactyl API Error:', error.response?.data || error.message);
      throw new Error('Failed to create Pterodactyl user');
    }
  }

  async deleteUser(userId) {
    try {
      await this.client.delete(`/api/application/users/${userId}`);
      return true;
    } catch (error) {
      console.error('Pterodactyl API Error:', error.response?.data || error.message);
      throw new Error('Failed to delete Pterodactyl user');
    }
  }

  async getUser(userId) {
    try {
      const response = await this.client.get(`/api/application/users/${userId}`);
      return response.data.attributes;
    } catch (error) {
      console.error('Pterodactyl API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch Pterodactyl user');
    }
  }
}

module.exports = new PterodactylService();