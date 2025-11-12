import PublicInfo from '../models/publicInfoModel.js';

// Get all visible public info
export const getPublicInfo = async (req, res) => {
  try {
    const infos = await PublicInfo.find({ visible: true });
    res.json(infos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a public info entry (admin only)
export const createPublicInfo = async (req, res) => {
  try {
    const { title, content, visible } = req.body;
    const info = new PublicInfo({ title, content, visible });
    await info.save();
    res.status(201).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing public info by id (admin only)
export const updatePublicInfo = async (req, res) => {
  try {
    const info = await PublicInfo.findById(req.params.id);
    if (!info) return res.status(404).json({ message: 'Public info not found' });

    const { title, content, visible } = req.body;
    if (title !== undefined) info.title = title;
    if (content !== undefined) info.content = content;
    if (visible !== undefined) info.visible = visible;

    await info.save();
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete public info by id (admin only)
export const deletePublicInfo = async (req, res) => {
  try {
    const info = await PublicInfo.findById(req.params.id);
    if (!info) return res.status(404).json({ message: 'Public info not found' });

    await info.remove();
    res.json({ message: 'Public info deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
