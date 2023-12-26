const supabase = require('../db/db');

const profileController = {
  // Read all user profiles
  async getAllUserProfiles(req, res) {
    let { data, error } = await supabase
      .from('user_profiles')
      .select('*');

    if (error) return res.status(500).json({ error });
    res.json(data);
  },

  // Create a user profile
  async createUserProfile(req, res) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([req.body]);

    if (error) return res.status(500).json({ error });
    res.status(201).json(data);
  },

  // Update a user profile
  async updateUserProfile(req, res) {
    const { profileId } = req.params;
    const { data, error } = await supabase
      .from('user_profiles')
      .update(req.body)
      .eq('profile_id', profileId);

    if (error) return res.status(500).json({ error });
    res.json(data);
  },

  // Delete a user profile
  async deleteUserProfile(req, res) {
    const { profileId } = req.params;
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('profile_id', profileId);

    if (error) return res.status(500).json({ error });
    res.json({ message: 'Profile deleted successfully' });
  },

  // Read a specific user profile
  async getUserProfile(req, res) {
    const { userId } = req.params;
    let { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return res.status(500).json({ error });
    res.json(data);
  }
};

module.exports = profileController;
