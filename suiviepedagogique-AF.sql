--
-- PostgreSQL database dump
--

\restrict dThwCWxYIVwYXyetwNO9Lcct5K1im6Rrzm5d6ZQ3VLtqO3gG8WnXXXDXS9BuHyh

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-19 16:41:52

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 256 (class 1259 OID 24987)
-- Name: a_propos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.a_propos (
    id integer NOT NULL,
    nom_etablissement character varying(200) DEFAULT 'Alliance Française'::character varying NOT NULL,
    tel character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    adresse text NOT NULL,
    heure_ouverture time without time zone NOT NULL,
    heure_fermeture time without time zone NOT NULL,
    jours_ouverture character varying(100) DEFAULT 'Lundi au Vendredi'::character varying NOT NULL,
    description text,
    logo_url character varying(255),
    date_mise_a_jour timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT a_propos_heure_check CHECK ((heure_fermeture > heure_ouverture))
);


ALTER TABLE public.a_propos OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 24986)
-- Name: a_propos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.a_propos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.a_propos_id_seq OWNER TO postgres;

--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 255
-- Name: a_propos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.a_propos_id_seq OWNED BY public.a_propos.id;


--
-- TOC entry 238 (class 1259 OID 24582)
-- Name: apprenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apprenant (
    id integer NOT NULL,
    nom text NOT NULL,
    prenom text NOT NULL,
    date_n date,
    sexe character varying(10),
    adresse text,
    tel character varying(15),
    email character varying(100),
    nationalite character varying(50),
    lieu_n character varying(100),
    etablissement text,
    niveau_scolaire character varying(50),
    date_premiere_inscription date DEFAULT CURRENT_DATE,
    statut character varying(20) DEFAULT 'actif'::character varying,
    CONSTRAINT apprenant_statut_check CHECK (((statut)::text = ANY ((ARRAY['actif'::character varying, 'abandon'::character varying])::text[])))
);


ALTER TABLE public.apprenant OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24581)
-- Name: apprenant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.apprenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.apprenant_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 237
-- Name: apprenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.apprenant_id_seq OWNED BY public.apprenant.id;


--
-- TOC entry 248 (class 1259 OID 24830)
-- Name: attribution_salle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attribution_salle (
    id integer NOT NULL,
    id_groupe integer NOT NULL,
    date_cours date NOT NULL,
    id_salle integer NOT NULL
);


ALTER TABLE public.attribution_salle OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 24829)
-- Name: attribution_salle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attribution_salle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attribution_salle_id_seq OWNER TO postgres;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 247
-- Name: attribution_salle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attribution_salle_id_seq OWNED BY public.attribution_salle.id;


--
-- TOC entry 254 (class 1259 OID 24949)
-- Name: categorie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorie (
    id integer NOT NULL,
    nom_categorie character varying(50) NOT NULL,
    min_age integer NOT NULL,
    max_age integer NOT NULL
);


ALTER TABLE public.categorie OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 24948)
-- Name: categorie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorie_id_seq OWNER TO postgres;

--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 253
-- Name: categorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorie_id_seq OWNED BY public.categorie.id;


--
-- TOC entry 242 (class 1259 OID 24717)
-- Name: creneau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creneau (
    id integer NOT NULL,
    id_horaire_cours integer NOT NULL,
    jour_semaine character varying(10)[] NOT NULL,
    heure_debut time without time zone NOT NULL,
    heure_fin time without time zone NOT NULL,
    CONSTRAINT creneau_check CHECK ((heure_fin > heure_debut)),
    CONSTRAINT creneau_jours_valides CHECK ((jour_semaine <@ ARRAY['lundi'::character varying(10), 'mardi'::character varying(10), 'mercredi'::character varying(10), 'jeudi'::character varying(10), 'vendredi'::character varying(10), 'samedi'::character varying(10), 'dimanche'::character varying(10)]))
);


ALTER TABLE public.creneau OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24716)
-- Name: creneau_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.creneau_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.creneau_id_seq OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 241
-- Name: creneau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.creneau_id_seq OWNED BY public.creneau.id;


--
-- TOC entry 219 (class 1259 OID 16414)
-- Name: employe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employe (
    id integer NOT NULL,
    nom text NOT NULL,
    prenom text NOT NULL,
    age integer,
    adresse text,
    tel character varying(15),
    mot_passe character varying(255) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(100),
    is_active boolean DEFAULT true,
    deactivated_at timestamp without time zone,
    deactivated_by integer,
    role text
);


ALTER TABLE public.employe OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16425)
-- Name: employe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employe_id_seq OWNER TO postgres;

--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 220
-- Name: employe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employe_id_seq OWNED BY public.employe.id;


--
-- TOC entry 221 (class 1259 OID 16426)
-- Name: examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examen (
    id integer NOT NULL,
    id_inscription integer,
    etat_inscription boolean,
    auto_inscription boolean,
    verification boolean
);


ALTER TABLE public.examen OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16430)
-- Name: examen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examen_id_seq OWNER TO postgres;

--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 222
-- Name: examen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examen_id_seq OWNED BY public.examen.id;


--
-- TOC entry 246 (class 1259 OID 24805)
-- Name: groupe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groupe (
    id integer NOT NULL,
    nom_groupe character varying(60) NOT NULL,
    id_professeur integer NOT NULL,
    date_creation date DEFAULT CURRENT_DATE,
    id_creneau integer
);


ALTER TABLE public.groupe OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 24804)
-- Name: groupe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groupe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groupe_id_seq OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 245
-- Name: groupe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groupe_id_seq OWNED BY public.groupe.id;


--
-- TOC entry 240 (class 1259 OID 24604)
-- Name: horaire_cours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horaire_cours (
    id integer NOT NULL,
    id_session integer NOT NULL,
    id_niveau integer[],
    id_categorie integer,
    duree_heures integer DEFAULT 30,
    duree_semaines integer DEFAULT 5,
    CONSTRAINT horaire_cours_duree_heures_check CHECK ((duree_heures > 0)),
    CONSTRAINT horaire_cours_duree_semaines_check CHECK ((duree_semaines > 0))
);


ALTER TABLE public.horaire_cours OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE horaire_cours; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.horaire_cours IS 'Définit les paramètres pédagogiques d''une session (remplace session_cours)';


--
-- TOC entry 239 (class 1259 OID 24603)
-- Name: horaire_cours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horaire_cours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horaire_cours_id_seq OWNER TO postgres;

--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 239
-- Name: horaire_cours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horaire_cours_id_seq OWNED BY public.horaire_cours.id;


--
-- TOC entry 250 (class 1259 OID 24853)
-- Name: inscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscription (
    id integer NOT NULL,
    id_apprenant integer NOT NULL,
    id_employe integer,
    id_session integer NOT NULL,
    id_motivation integer,
    num_carte character varying(20),
    ticket text,
    etat_inscription text DEFAULT 'inscription'::text,
    date_inscription timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_niveau integer,
    id_categorie integer,
    id_creneau integer,
    id_groupe integer,
    validation_examen boolean,
    note numeric(4,2),
    CONSTRAINT inscription_etat_inscription_check CHECK ((etat_inscription = ANY (ARRAY['inscription'::text, 'reinscription'::text, 'terminee'::text, 'abandon'::text, 'en_attente'::text]))),
    CONSTRAINT inscription_note_check CHECK (((note >= (0)::numeric) AND (note <= (20)::numeric)))
);


ALTER TABLE public.inscription OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 24852)
-- Name: inscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscription_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 249
-- Name: inscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscription_id_seq OWNED BY public.inscription.id;


--
-- TOC entry 223 (class 1259 OID 16454)
-- Name: motivation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motivation (
    id integer NOT NULL,
    nom_motivation character varying(200)
);


ALTER TABLE public.motivation OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16458)
-- Name: motivation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.motivation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.motivation_id_seq OWNER TO postgres;

--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 224
-- Name: motivation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.motivation_id_seq OWNED BY public.motivation.id;


--
-- TOC entry 225 (class 1259 OID 16459)
-- Name: niveau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.niveau (
    id integer NOT NULL,
    nom_niveau character varying(5) NOT NULL,
    sous_niveau integer,
    code character varying(6) GENERATED ALWAYS AS (
CASE
    WHEN (sous_niveau IS NULL) THEN (nom_niveau)::text
    ELSE (((nom_niveau)::text || '.'::text) || sous_niveau)
END) STORED
);


ALTER TABLE public.niveau OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16464)
-- Name: niveau_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.niveau_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.niveau_id_seq OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 226
-- Name: niveau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.niveau_id_seq OWNED BY public.niveau.id;


--
-- TOC entry 252 (class 1259 OID 24908)
-- Name: presence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presence (
    id integer NOT NULL,
    id_inscription integer NOT NULL,
    id_groupe integer NOT NULL,
    date_cours date NOT NULL,
    est_present boolean DEFAULT true,
    remarque text,
    id_employe_saisie integer,
    date_saisie timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.presence OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 24907)
-- Name: presence_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.presence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.presence_id_seq OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 251
-- Name: presence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presence_id_seq OWNED BY public.presence.id;


--
-- TOC entry 244 (class 1259 OID 24786)
-- Name: professeur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professeur (
    id integer NOT NULL,
    id_employe integer NOT NULL,
    specialite_niveaux character varying(10)[] DEFAULT '{}'::character varying[]
);


ALTER TABLE public.professeur OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24785)
-- Name: professeur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professeur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professeur_id_seq OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 243
-- Name: professeur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professeur_id_seq OWNED BY public.professeur.id;


--
-- TOC entry 227 (class 1259 OID 16484)
-- Name: salle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salle (
    id integer NOT NULL,
    nom_salle character varying(10) NOT NULL,
    capacite_max integer
);


ALTER TABLE public.salle OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16489)
-- Name: salle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salle_id_seq OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 228
-- Name: salle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salle_id_seq OWNED BY public.salle.id;


--
-- TOC entry 229 (class 1259 OID 16490)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id integer NOT NULL,
    mois character varying(10),
    annee integer,
    id_type_cours integer,
    date_fin_inscription date,
    date_debut date,
    date_fin date,
    date_exam date,
    nom_session character varying(100),
    duree_cours integer DEFAULT 0
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16501)
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 230
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- TOC entry 231 (class 1259 OID 16502)
-- Name: test_niveau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_niveau (
    id integer NOT NULL,
    date_test date,
    nom text NOT NULL,
    prenom text NOT NULL,
    id_type_cours integer,
    po text,
    pe text,
    niveau_d character varying(5),
    remarque character varying(255),
    id_employe integer
);


ALTER TABLE public.test_niveau OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16510)
-- Name: test_niveau_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_niveau_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_niveau_id_seq OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 232
-- Name: test_niveau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_niveau_id_seq OWNED BY public.test_niveau.id;


--
-- TOC entry 233 (class 1259 OID 16511)
-- Name: type_cours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_cours (
    id integer NOT NULL,
    id_type_service integer,
    nom_type_cours character varying(50) NOT NULL
);


ALTER TABLE public.type_cours OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16516)
-- Name: type_cours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_cours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_cours_id_seq OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 234
-- Name: type_cours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_cours_id_seq OWNED BY public.type_cours.id;


--
-- TOC entry 235 (class 1259 OID 16517)
-- Name: type_service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_service (
    id integer NOT NULL,
    nom_service character varying(20) NOT NULL,
    libelle text
);


ALTER TABLE public.type_service OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16522)
-- Name: type_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_service_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 236
-- Name: type_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_service_id_seq OWNED BY public.type_service.id;


--
-- TOC entry 4931 (class 2604 OID 24990)
-- Name: a_propos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.a_propos ALTER COLUMN id SET DEFAULT nextval('public.a_propos_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 24585)
-- Name: apprenant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant ALTER COLUMN id SET DEFAULT nextval('public.apprenant_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 24833)
-- Name: attribution_salle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle ALTER COLUMN id SET DEFAULT nextval('public.attribution_salle_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 24952)
-- Name: categorie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie ALTER COLUMN id SET DEFAULT nextval('public.categorie_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 24720)
-- Name: creneau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau ALTER COLUMN id SET DEFAULT nextval('public.creneau_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16526)
-- Name: employe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe ALTER COLUMN id SET DEFAULT nextval('public.employe_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16527)
-- Name: examen id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen ALTER COLUMN id SET DEFAULT nextval('public.examen_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 24808)
-- Name: groupe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe ALTER COLUMN id SET DEFAULT nextval('public.groupe_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 24607)
-- Name: horaire_cours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours ALTER COLUMN id SET DEFAULT nextval('public.horaire_cours_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 24856)
-- Name: inscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription ALTER COLUMN id SET DEFAULT nextval('public.inscription_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16531)
-- Name: motivation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivation ALTER COLUMN id SET DEFAULT nextval('public.motivation_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16532)
-- Name: niveau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveau ALTER COLUMN id SET DEFAULT nextval('public.niveau_id_seq'::regclass);


--
-- TOC entry 4927 (class 2604 OID 24911)
-- Name: presence id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence ALTER COLUMN id SET DEFAULT nextval('public.presence_id_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 24789)
-- Name: professeur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur ALTER COLUMN id SET DEFAULT nextval('public.professeur_id_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16535)
-- Name: salle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salle ALTER COLUMN id SET DEFAULT nextval('public.salle_id_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 16536)
-- Name: session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 16538)
-- Name: test_niveau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau ALTER COLUMN id SET DEFAULT nextval('public.test_niveau_id_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16539)
-- Name: type_cours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours ALTER COLUMN id SET DEFAULT nextval('public.type_cours_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 16540)
-- Name: type_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_service ALTER COLUMN id SET DEFAULT nextval('public.type_service_id_seq'::regclass);


--
-- TOC entry 5208 (class 0 OID 24987)
-- Dependencies: 256
-- Data for Name: a_propos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.a_propos (id, nom_etablissement, tel, email, adresse, heure_ouverture, heure_fermeture, jours_ouverture, description, logo_url, date_mise_a_jour) FROM stdin;
1	Alliance Française Mahajanga	032 05 119 84	afmsec3@gmail.com	Rue Edouard VII - BP 236 - 401 Majunga	08:00:00	18:00:00	Lundi au Samedi	L'Alliance Française Mahajanga est un établissement culturel et linguistique dédié à la promotion de la langue française et des cultures francophones. Fondée en 1950, notre institution propose des cours de français pour tous niveaux, des préparations aux examens DELF/DALF, ainsi que des activités culturelles régulières. Notre équipe de professeurs qualifiés et passionnés s'engage à offrir un enseignement de qualité dans un environnement chaleureux et multiculturel.	\N	2026-02-17 13:59:45.027597
\.


--
-- TOC entry 5190 (class 0 OID 24582)
-- Dependencies: 238
-- Data for Name: apprenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apprenant (id, nom, prenom, date_n, sexe, adresse, tel, email, nationalite, lieu_n, etablissement, niveau_scolaire, date_premiere_inscription, statut) FROM stdin;
1	tinah	dorea	2004-10-05	F	Sotema	0325896471	dorea@gmail.com	Malagasy	Mahajanga	Saint Gabriel	L3	2026-02-17	actif
2	MIARILAZA	Juditch	2003-05-02	F	Antanimasatsa	0324442269	\N	Malagasy	Mahajanga	Saint Gabriel	L3	2026-02-17	actif
3	tinah	dorea	2004-05-02	F	Sotema	0325896471	\N	\N	\N	Saint Gabriel	L3	2026-02-17	actif
\.


--
-- TOC entry 5200 (class 0 OID 24830)
-- Dependencies: 248
-- Data for Name: attribution_salle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attribution_salle (id, id_groupe, date_cours, id_salle) FROM stdin;
\.


--
-- TOC entry 5206 (class 0 OID 24949)
-- Dependencies: 254
-- Data for Name: categorie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorie (id, nom_categorie, min_age, max_age) FROM stdin;
1	Précoce	3	6
2	Enfant	8	11
3	Ado	12	17
4	Adulte	18	89
\.


--
-- TOC entry 5194 (class 0 OID 24717)
-- Dependencies: 242
-- Data for Name: creneau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creneau (id, id_horaire_cours, jour_semaine, heure_debut, heure_fin) FROM stdin;
1	3	{lundi,mardi,mercredi,jeudi,vendredi}	08:00:00	11:00:00
2	4	{lundi,mardi,mercredi,jeudi,vendredi}	15:00:00	18:00:00
\.


--
-- TOC entry 5171 (class 0 OID 16414)
-- Dependencies: 219
-- Data for Name: employe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employe (id, nom, prenom, age, adresse, tel, mot_passe, date_creation, email, is_active, deactivated_at, deactivated_by, role) FROM stdin;
1	tinah	dorea	21	Sotema	0324442269	$2b$10$/lVcr/.ubV73Q4AacknKgOxu7q7HHFDCNrR1GL1YSWWmg4a7xdrFu	2025-10-24 17:36:44.301241	tdorea@gmail.com	t	\N	\N	Coordinateur adjoint
3	tina	dorea	30	Sotema	0341234567	$2b$10$hVpnsRl4Tg9dRA4f4uMKnO5IuVJEMEq2jxfK69x.lHtl0wtK1NrNm	2025-11-04 17:32:55.930466	tinahdorea@gmail.com	t	\N	\N	Admin
4	toky	jerrys	23	sotema	0325689741	$2b$10$/aIoB.DBY/gOXIwaK1LD3euW14dDhEq81dtEbyVTX5Fh42cijo11u	2025-12-12 16:41:52.876033	jerrys@gmail.com	t	\N	\N	professeurs
2	Tokys	jerrys	25	Sotema	0325896471	$2b$10$nf9xsh7oU5h6Igm/nUwyyuMFiPUV10HOu0bKv.NGzyclvlxwKiedW	2025-10-25 16:44:31.615915	toky@gmail.com	t	\N	\N	Admin
5	Shania	Amara	21	Mahabibo	0325869855	$2b$10$4533PoTfC.EIPfjqwAxbee2x7cyNN47aMA4/7bst4MgJITRu9IdpO	2026-01-10 01:54:58.034594	shania@gmail.com	t	\N	\N	professeurs
\.


--
-- TOC entry 5173 (class 0 OID 16426)
-- Dependencies: 221
-- Data for Name: examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examen (id, id_inscription, etat_inscription, auto_inscription, verification) FROM stdin;
2	2	t	f	f
1	1	t	t	t
\.


--
-- TOC entry 5198 (class 0 OID 24805)
-- Dependencies: 246
-- Data for Name: groupe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groupe (id, nom_groupe, id_professeur, date_creation, id_creneau) FROM stdin;
\.


--
-- TOC entry 5192 (class 0 OID 24604)
-- Dependencies: 240
-- Data for Name: horaire_cours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horaire_cours (id, id_session, id_niveau, id_categorie, duree_heures, duree_semaines) FROM stdin;
3	13	{1}	4	30	2
4	13	{6,7,8,9,10}	4	30	2
\.


--
-- TOC entry 5202 (class 0 OID 24853)
-- Dependencies: 250
-- Data for Name: inscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscription (id, id_apprenant, id_employe, id_session, id_motivation, num_carte, ticket, etat_inscription, date_inscription, id_niveau, id_categorie, id_creneau, id_groupe, validation_examen, note) FROM stdin;
\.


--
-- TOC entry 5175 (class 0 OID 16454)
-- Dependencies: 223
-- Data for Name: motivation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.motivation (id, nom_motivation) FROM stdin;
1	Intéressé par la langue française
2	Besoin professionnel
3	Préparation à un voyage
4	Études universitaires
5	Loisir personnel
6	Évolution de carrière
7	Préparation à un examen officiel
8	Exigence professionnelle
9	Etude
10	Travail
\.


--
-- TOC entry 5177 (class 0 OID 16459)
-- Dependencies: 225
-- Data for Name: niveau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.niveau (id, nom_niveau, sous_niveau) FROM stdin;
1	A1	1
2	A1	2
3	A1	3
4	A1	4
6	B2	1
7	B2	2
8	B2	3
9	B2	4
10	B2	5
5	A1	5
11	A2	1
12	A2	2
13	A2	3
14	C1	1
15	C2	2
\.


--
-- TOC entry 5204 (class 0 OID 24908)
-- Dependencies: 252
-- Data for Name: presence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presence (id, id_inscription, id_groupe, date_cours, est_present, remarque, id_employe_saisie, date_saisie) FROM stdin;
\.


--
-- TOC entry 5196 (class 0 OID 24786)
-- Dependencies: 244
-- Data for Name: professeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professeur (id, id_employe, specialite_niveaux) FROM stdin;
1	4	{}
2	5	{}
\.


--
-- TOC entry 5179 (class 0 OID 16484)
-- Dependencies: 227
-- Data for Name: salle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salle (id, nom_salle, capacite_max) FROM stdin;
2	Salle A	20
3	Salle 1	20
\.


--
-- TOC entry 5181 (class 0 OID 16490)
-- Dependencies: 229
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam, nom_session, duree_cours) FROM stdin;
2	Janvier	2024	1	2024-01-15	2024-01-20	2024-05-20	2024-05-25	\N	0
3	Janvier	2025	1	2025-10-27	2025-11-03	2025-11-21	2025-11-24	\N	0
1	Octobre	2025	2	2025-10-11	2025-10-19	2025-11-09	2025-11-16	\N	0
5	Novembre	2025	4	2025-10-18	2025-10-20	2025-11-03	2025-11-17	\N	0
6	Janvier	2026	\N	2026-01-15	2026-01-20	2026-03-20	2026-03-25	\N	0
8	Juillet	2026	\N	2026-07-01	2026-07-05	2026-08-20	2026-08-25	\N	0
9	Octobre	2026	\N	2026-09-25	2026-10-01	2026-12-15	2026-12-20	\N	0
7	Avril	2026	1	2026-04-04	2026-04-09	2026-06-14	2026-06-19	\N	0
10	Janvier	2027	3	2027-01-09	2027-01-14	2027-03-24	2027-03-29	\N	0
11	Avril	2027	2	2027-03-31	2027-04-04	2027-06-09	2027-06-14	\N	0
12	février	2026	1	2026-01-31	2026-02-02	2026-02-27	2026-02-27	session fevrier	0
13	Février	2026	2	2026-02-16	2026-02-23	2026-03-06	\N	session février cours intensif	0
\.


--
-- TOC entry 5183 (class 0 OID 16502)
-- Dependencies: 231
-- Data for Name: test_niveau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_niveau (id, date_test, nom, prenom, id_type_cours, po, pe, niveau_d, remarque, id_employe) FROM stdin;
\.


--
-- TOC entry 5185 (class 0 OID 16511)
-- Dependencies: 233
-- Data for Name: type_cours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_cours (id, id_type_service, nom_type_cours) FROM stdin;
1	1	Cours régulier
2	1	Cours Intensif
3	1	Cours Extensifs
4	2	Prepa TP
5	2	Prepa Junior
\.


--
-- TOC entry 5187 (class 0 OID 16517)
-- Dependencies: 235
-- Data for Name: type_service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_service (id, nom_service, libelle) FROM stdin;
2	Prepa	Préparation aux examens DELF/DALF
1	Renforcements	Cours de renforcement linguistique pour tous niveaux
3	Vacances	Cours intensifs pendant les vacances scolaires
\.


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 255
-- Name: a_propos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.a_propos_id_seq', 1, true);


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 237
-- Name: apprenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.apprenant_id_seq', 3, true);


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 247
-- Name: attribution_salle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attribution_salle_id_seq', 1, false);


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 253
-- Name: categorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorie_id_seq', 4, true);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 241
-- Name: creneau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.creneau_id_seq', 2, true);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 220
-- Name: employe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employe_id_seq', 5, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 222
-- Name: examen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examen_id_seq', 2, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 245
-- Name: groupe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groupe_id_seq', 1, false);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 239
-- Name: horaire_cours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horaire_cours_id_seq', 4, true);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 249
-- Name: inscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscription_id_seq', 1, false);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 224
-- Name: motivation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.motivation_id_seq', 10, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 226
-- Name: niveau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.niveau_id_seq', 17, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 251
-- Name: presence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presence_id_seq', 1, false);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 243
-- Name: professeur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professeur_id_seq', 2, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 228
-- Name: salle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salle_id_seq', 3, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 230
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_id_seq', 13, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 232
-- Name: test_niveau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_niveau_id_seq', 1, false);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 234
-- Name: type_cours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_cours_id_seq', 5, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 236
-- Name: type_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_service_id_seq', 7, true);


--
-- TOC entry 4999 (class 2606 OID 25006)
-- Name: a_propos a_propos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.a_propos
    ADD CONSTRAINT a_propos_pkey PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 24597)
-- Name: apprenant apprenant_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_email_key UNIQUE (email);


--
-- TOC entry 4967 (class 2606 OID 24595)
-- Name: apprenant apprenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 24841)
-- Name: attribution_salle attribution_salle_id_groupe_date_cours_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_groupe_date_cours_key UNIQUE (id_groupe, date_cours);


--
-- TOC entry 4983 (class 2606 OID 24839)
-- Name: attribution_salle attribution_salle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 24958)
-- Name: categorie categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 24729)
-- Name: creneau creneau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau
    ADD CONSTRAINT creneau_pkey PRIMARY KEY (id);


--
-- TOC entry 4944 (class 2606 OID 16550)
-- Name: employe employe_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_email_key UNIQUE (email);


--
-- TOC entry 4946 (class 2606 OID 16552)
-- Name: employe employe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 16554)
-- Name: examen examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT examen_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 24815)
-- Name: groupe groupe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 24620)
-- Name: horaire_cours horaire_cours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours
    ADD CONSTRAINT horaire_cours_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 24974)
-- Name: horaire_cours horaire_cours_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours
    ADD CONSTRAINT horaire_cours_unique UNIQUE (id_session, id_niveau, id_categorie);


--
-- TOC entry 4990 (class 2606 OID 24866)
-- Name: inscription inscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 16564)
-- Name: motivation motivation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivation
    ADD CONSTRAINT motivation_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 16566)
-- Name: niveau niveau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveau
    ADD CONSTRAINT niveau_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 24923)
-- Name: presence presence_id_inscription_date_cours_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_inscription_date_cours_key UNIQUE (id_inscription, date_cours);


--
-- TOC entry 4995 (class 2606 OID 24921)
-- Name: presence presence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 24798)
-- Name: professeur professeur_id_employe_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_id_employe_key UNIQUE (id_employe);


--
-- TOC entry 4977 (class 2606 OID 24796)
-- Name: professeur professeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16572)
-- Name: salle salle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salle
    ADD CONSTRAINT salle_pkey PRIMARY KEY (id);


--
-- TOC entry 4957 (class 2606 OID 16578)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 16580)
-- Name: test_niveau test_niveau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_pkey PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 16582)
-- Name: type_cours type_cours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours
    ADD CONSTRAINT type_cours_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 16584)
-- Name: type_service type_service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_service
    ADD CONSTRAINT type_service_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 1259 OID 25007)
-- Name: idx_a_propos_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_a_propos_email ON public.a_propos USING btree (email);


--
-- TOC entry 5001 (class 1259 OID 25008)
-- Name: idx_a_propos_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_a_propos_tel ON public.a_propos USING btree (tel);


--
-- TOC entry 4984 (class 1259 OID 24945)
-- Name: idx_attribution_salle_groupe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attribution_salle_groupe ON public.attribution_salle USING btree (id_groupe);


--
-- TOC entry 4947 (class 1259 OID 16587)
-- Name: idx_employe_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_is_active ON public.employe USING btree (is_active);


--
-- TOC entry 4985 (class 1259 OID 24939)
-- Name: idx_inscription_apprenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_apprenant ON public.inscription USING btree (id_apprenant);


--
-- TOC entry 4986 (class 1259 OID 24942)
-- Name: idx_inscription_creneau; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_creneau ON public.inscription USING btree (id_creneau) WHERE (id_creneau IS NOT NULL);


--
-- TOC entry 4987 (class 1259 OID 24940)
-- Name: idx_inscription_groupe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_groupe ON public.inscription USING btree (id_groupe) WHERE (id_groupe IS NOT NULL);


--
-- TOC entry 4988 (class 1259 OID 24941)
-- Name: idx_inscription_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_session ON public.inscription USING btree (id_session);


--
-- TOC entry 4991 (class 1259 OID 24944)
-- Name: idx_presence_groupe_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presence_groupe_date ON public.presence USING btree (id_groupe, date_cours);


--
-- TOC entry 5012 (class 2606 OID 24842)
-- Name: attribution_salle attribution_salle_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE CASCADE;


--
-- TOC entry 5013 (class 2606 OID 24847)
-- Name: attribution_salle attribution_salle_id_salle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_salle_fkey FOREIGN KEY (id_salle) REFERENCES public.salle(id);


--
-- TOC entry 5008 (class 2606 OID 24730)
-- Name: creneau creneau_id_horaire_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau
    ADD CONSTRAINT creneau_id_horaire_cours_fkey FOREIGN KEY (id_horaire_cours) REFERENCES public.horaire_cours(id) ON DELETE CASCADE;


--
-- TOC entry 5002 (class 2606 OID 16613)
-- Name: employe fk_deactivated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT fk_deactivated_by FOREIGN KEY (deactivated_by) REFERENCES public.employe(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5010 (class 2606 OID 25009)
-- Name: groupe groupe_id_creneau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_id_creneau_fkey FOREIGN KEY (id_creneau) REFERENCES public.creneau(id) ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 24823)
-- Name: groupe groupe_id_professeur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_id_professeur_fkey FOREIGN KEY (id_professeur) REFERENCES public.professeur(id) ON DELETE RESTRICT;


--
-- TOC entry 5007 (class 2606 OID 24623)
-- Name: horaire_cours horaire_cours_id_session_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours
    ADD CONSTRAINT horaire_cours_id_session_fkey FOREIGN KEY (id_session) REFERENCES public.session(id) ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 24867)
-- Name: inscription inscription_id_apprenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_apprenant_fkey FOREIGN KEY (id_apprenant) REFERENCES public.apprenant(id) ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 24897)
-- Name: inscription inscription_id_creneau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_creneau_fkey FOREIGN KEY (id_creneau) REFERENCES public.creneau(id) ON DELETE SET NULL;


--
-- TOC entry 5016 (class 2606 OID 24872)
-- Name: inscription inscription_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON DELETE SET NULL;


--
-- TOC entry 5017 (class 2606 OID 24902)
-- Name: inscription inscription_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE SET NULL;


--
-- TOC entry 5018 (class 2606 OID 24882)
-- Name: inscription inscription_id_motivation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_motivation_fkey FOREIGN KEY (id_motivation) REFERENCES public.motivation(id) ON DELETE SET NULL;


--
-- TOC entry 5019 (class 2606 OID 24887)
-- Name: inscription inscription_id_niveau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_niveau_fkey FOREIGN KEY (id_niveau) REFERENCES public.niveau(id) ON DELETE SET NULL;


--
-- TOC entry 5020 (class 2606 OID 24877)
-- Name: inscription inscription_id_session_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_session_fkey FOREIGN KEY (id_session) REFERENCES public.session(id) ON DELETE RESTRICT;


--
-- TOC entry 5021 (class 2606 OID 24934)
-- Name: presence presence_id_employe_saisie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_employe_saisie_fkey FOREIGN KEY (id_employe_saisie) REFERENCES public.employe(id);


--
-- TOC entry 5022 (class 2606 OID 24929)
-- Name: presence presence_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 24924)
-- Name: presence presence_id_inscription_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_inscription_fkey FOREIGN KEY (id_inscription) REFERENCES public.inscription(id) ON DELETE CASCADE;


--
-- TOC entry 5009 (class 2606 OID 24799)
-- Name: professeur professeur_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- TOC entry 5003 (class 2606 OID 16708)
-- Name: session session_id_type_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_id_type_cours_fkey FOREIGN KEY (id_type_cours) REFERENCES public.type_cours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5004 (class 2606 OID 16713)
-- Name: test_niveau test_niveau_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5005 (class 2606 OID 16718)
-- Name: test_niveau test_niveau_id_type_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_id_type_cours_fkey FOREIGN KEY (id_type_cours) REFERENCES public.type_cours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5006 (class 2606 OID 16723)
-- Name: type_cours type_cours_id_type_service_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours
    ADD CONSTRAINT type_cours_id_type_service_fkey FOREIGN KEY (id_type_service) REFERENCES public.type_service(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-02-19 16:41:53

--
-- PostgreSQL database dump complete
--

\unrestrict dThwCWxYIVwYXyetwNO9Lcct5K1im6Rrzm5d6ZQ3VLtqO3gG8WnXXXDXS9BuHyh

