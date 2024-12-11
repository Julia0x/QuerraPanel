const { saveUser, getUser } = require('../services/database');
const pterodactyl = require('../services/pterodactyl');
const { generatePassword } = require('../utils/security');

class User {
  static async create(profile) {
    const pterodactylPassword = generatePassword();
    
    const pterodactylUser = await pterodactyl.createUser({
      email: profile.email,
      username: profile.username,
      password: pterodactylPassword
    });

    const user = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      avatar: profile.avatar,
      pterodactylId: pterodactylUser.id,
      pterodactylUuid: pterodactylUser.uuid,
      pterodactylUsername: pterodactylUser.username,
      pterodactylPassword: pterodactylPassword,
      createdAt: new Date().toISOString()
    };

    await saveUser(user);
    return user;
  }

  static async findOrCreate(profile) {
    let user = await getUser(profile.id);
    if (!user) {
      user = await this.create(profile);
    } else {
      user.avatar = profile.avatar;
      await saveUser(user);
    }
    return user;
  }
}

module.exports = User;