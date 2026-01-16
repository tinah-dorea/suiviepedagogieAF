import { pool } from '../config/db.js';

const getAllTests = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM test_niveau ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTestById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM test_niveau WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Test non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTest = async (req, res) => {
    const { date_test, nom, prenom, id_type_cours, po, pe, niveau_d, remarque, id_employe } = req.body;
    if (!date_test || !nom || !prenom) return res.status(400).json({ message: 'date_test, nom et prenom requis' });
    try {
        const result = await pool.query(
            `INSERT INTO test_niveau (date_test, nom, prenom, id_type_cours, po, pe, niveau_d, remarque, id_employe) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [date_test, nom, prenom, id_type_cours || null, po || null, pe || null, niveau_d || null, remarque || null, id_employe || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTest = async (req, res) => {
    const { id } = req.params;
    const { date_test, nom, prenom, id_type_cours, po, pe, niveau_d, remarque, id_employe } = req.body;
    try {
        const result = await pool.query(
            `UPDATE test_niveau SET date_test=$1, nom=$2, prenom=$3, id_type_cours=$4, po=$5, pe=$6, niveau_d=$7, remarque=$8, id_employe=$9 WHERE id=$10 RETURNING *`,
            [date_test, nom, prenom, id_type_cours || null, po || null, pe || null, niveau_d || null, remarque || null, id_employe || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Test non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM test_niveau WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Test non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllTests, getTestById, createTest, updateTest, deleteTest };
