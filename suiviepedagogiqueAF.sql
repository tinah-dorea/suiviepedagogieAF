--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-03-03 21:03:13

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
-- TOC entry 217 (class 1259 OID 16388)
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
-- TOC entry 218 (class 1259 OID 16397)
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
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 218
-- Name: a_propos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.a_propos_id_seq OWNED BY public.a_propos.id;


--
-- TOC entry 219 (class 1259 OID 16398)
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
    mot_passe character varying(255) NOT NULL,
    CONSTRAINT apprenant_statut_check CHECK (((statut)::text = ANY (ARRAY[('actif'::character varying)::text, ('abandon'::character varying)::text])))
);


ALTER TABLE public.apprenant OWNER TO postgres;

--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN apprenant.mot_passe; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.apprenant.mot_passe IS 'Mot de passe hashé avec bcrypt pour l''authentification';


--
-- TOC entry 220 (class 1259 OID 16406)
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
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 220
-- Name: apprenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.apprenant_id_seq OWNED BY public.apprenant.id;


--
-- TOC entry 221 (class 1259 OID 16407)
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
-- TOC entry 222 (class 1259 OID 16410)
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
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 222
-- Name: attribution_salle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attribution_salle_id_seq OWNED BY public.attribution_salle.id;


--
-- TOC entry 223 (class 1259 OID 16411)
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
-- TOC entry 224 (class 1259 OID 16414)
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
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 224
-- Name: categorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorie_id_seq OWNED BY public.categorie.id;


--
-- TOC entry 225 (class 1259 OID 16415)
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
-- TOC entry 226 (class 1259 OID 16422)
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
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 226
-- Name: creneau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.creneau_id_seq OWNED BY public.creneau.id;


--
-- TOC entry 227 (class 1259 OID 16423)
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
-- TOC entry 228 (class 1259 OID 16430)
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
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 228
-- Name: employe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employe_id_seq OWNED BY public.employe.id;


--
-- TOC entry 229 (class 1259 OID 16431)
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
-- TOC entry 230 (class 1259 OID 16434)
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
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 230
-- Name: examen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examen_id_seq OWNED BY public.examen.id;


--
-- TOC entry 231 (class 1259 OID 16435)
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
-- TOC entry 232 (class 1259 OID 16439)
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
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 232
-- Name: groupe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groupe_id_seq OWNED BY public.groupe.id;


--
-- TOC entry 233 (class 1259 OID 16440)
-- Name: horaire_cours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horaire_cours (
    id integer NOT NULL,
    id_niveau integer[],
    id_categorie integer,
    duree_heures integer DEFAULT 30,
    duree_semaines integer DEFAULT 5,
    id_type_cours integer,
    CONSTRAINT horaire_cours_duree_heures_check CHECK ((duree_heures > 0)),
    CONSTRAINT horaire_cours_duree_semaines_check CHECK ((duree_semaines > 0))
);


ALTER TABLE public.horaire_cours OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE horaire_cours; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.horaire_cours IS 'Définit les paramètres pédagogiques d''une session (remplace session_cours)';


--
-- TOC entry 234 (class 1259 OID 16449)
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
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 234
-- Name: horaire_cours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horaire_cours_id_seq OWNED BY public.horaire_cours.id;


--
-- TOC entry 235 (class 1259 OID 16450)
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
-- TOC entry 236 (class 1259 OID 16459)
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
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 236
-- Name: inscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscription_id_seq OWNED BY public.inscription.id;


--
-- TOC entry 237 (class 1259 OID 16460)
-- Name: motivation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motivation (
    id integer NOT NULL,
    nom_motivation character varying(200)
);


ALTER TABLE public.motivation OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16463)
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
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 238
-- Name: motivation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.motivation_id_seq OWNED BY public.motivation.id;


--
-- TOC entry 239 (class 1259 OID 16464)
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
-- TOC entry 240 (class 1259 OID 16468)
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
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 240
-- Name: niveau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.niveau_id_seq OWNED BY public.niveau.id;


--
-- TOC entry 241 (class 1259 OID 16469)
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
-- TOC entry 242 (class 1259 OID 16476)
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
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 242
-- Name: presence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presence_id_seq OWNED BY public.presence.id;


--
-- TOC entry 243 (class 1259 OID 16477)
-- Name: professeur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professeur (
    id integer NOT NULL,
    id_employe integer NOT NULL,
    specialite_niveaux character varying(10)[] DEFAULT '{}'::character varying[]
);


ALTER TABLE public.professeur OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16483)
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
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 244
-- Name: professeur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professeur_id_seq OWNED BY public.professeur.id;


--
-- TOC entry 245 (class 1259 OID 16484)
-- Name: salle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salle (
    id integer NOT NULL,
    nom_salle character varying(10) NOT NULL,
    capacite_max integer
);


ALTER TABLE public.salle OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16487)
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
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 246
-- Name: salle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salle_id_seq OWNED BY public.salle.id;


--
-- TOC entry 247 (class 1259 OID 16488)
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
-- TOC entry 248 (class 1259 OID 16492)
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
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 248
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- TOC entry 249 (class 1259 OID 16493)
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
-- TOC entry 250 (class 1259 OID 16498)
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
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 250
-- Name: test_niveau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_niveau_id_seq OWNED BY public.test_niveau.id;


--
-- TOC entry 251 (class 1259 OID 16499)
-- Name: type_cours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_cours (
    id integer NOT NULL,
    id_type_service integer,
    nom_type_cours character varying(50) NOT NULL
);


ALTER TABLE public.type_cours OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16502)
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
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 252
-- Name: type_cours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_cours_id_seq OWNED BY public.type_cours.id;


--
-- TOC entry 253 (class 1259 OID 16503)
-- Name: type_service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_service (
    id integer NOT NULL,
    nom_service character varying(20) NOT NULL,
    libelle text
);


ALTER TABLE public.type_service OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16508)
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
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 254
-- Name: type_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_service_id_seq OWNED BY public.type_service.id;


--
-- TOC entry 4731 (class 2604 OID 16509)
-- Name: a_propos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.a_propos ALTER COLUMN id SET DEFAULT nextval('public.a_propos_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 16510)
-- Name: apprenant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant ALTER COLUMN id SET DEFAULT nextval('public.apprenant_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 16511)
-- Name: attribution_salle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle ALTER COLUMN id SET DEFAULT nextval('public.attribution_salle_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 16512)
-- Name: categorie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie ALTER COLUMN id SET DEFAULT nextval('public.categorie_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 16513)
-- Name: creneau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau ALTER COLUMN id SET DEFAULT nextval('public.creneau_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 16514)
-- Name: employe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe ALTER COLUMN id SET DEFAULT nextval('public.employe_id_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 16515)
-- Name: examen id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen ALTER COLUMN id SET DEFAULT nextval('public.examen_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16516)
-- Name: groupe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe ALTER COLUMN id SET DEFAULT nextval('public.groupe_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16517)
-- Name: horaire_cours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours ALTER COLUMN id SET DEFAULT nextval('public.horaire_cours_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16518)
-- Name: inscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription ALTER COLUMN id SET DEFAULT nextval('public.inscription_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 16519)
-- Name: motivation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivation ALTER COLUMN id SET DEFAULT nextval('public.motivation_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 16520)
-- Name: niveau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveau ALTER COLUMN id SET DEFAULT nextval('public.niveau_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16521)
-- Name: presence id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence ALTER COLUMN id SET DEFAULT nextval('public.presence_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16522)
-- Name: professeur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur ALTER COLUMN id SET DEFAULT nextval('public.professeur_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 16523)
-- Name: salle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salle ALTER COLUMN id SET DEFAULT nextval('public.salle_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16524)
-- Name: session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16525)
-- Name: test_niveau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau ALTER COLUMN id SET DEFAULT nextval('public.test_niveau_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 16526)
-- Name: type_cours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours ALTER COLUMN id SET DEFAULT nextval('public.type_cours_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 16527)
-- Name: type_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_service ALTER COLUMN id SET DEFAULT nextval('public.type_service_id_seq'::regclass);


--
-- TOC entry 5002 (class 0 OID 16388)
-- Dependencies: 217
-- Data for Name: a_propos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.a_propos (id, nom_etablissement, tel, email, adresse, heure_ouverture, heure_fermeture, jours_ouverture, description, logo_url, date_mise_a_jour) FROM stdin;
1	Alliance Française Mahajanga	032 05 119 84	afmsec3@gmail.com	Rue Edouard VII - BP 236 - 401 Majunga	08:00:00	18:00:00	Lundi au Samedi	L'Alliance Française Mahajanga est un établissement culturel et linguistique dédié à la promotion de la langue française et des cultures francophones. Fondée en 1950, notre institution propose des cours de français pour tous niveaux, des préparations aux examens DELF/DALF, ainsi que des activités culturelles régulières. Notre équipe de professeurs qualifiés et passionnés s'engage à offrir un enseignement de qualité dans un environnement chaleureux et multiculturel.	\N	2026-03-03 08:16:35.818953
\.


--
-- TOC entry 5004 (class 0 OID 16398)
-- Dependencies: 219
-- Data for Name: apprenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apprenant (id, nom, prenom, date_n, sexe, adresse, tel, email, nationalite, lieu_n, etablissement, niveau_scolaire, date_premiere_inscription, statut, mot_passe) FROM stdin;
2	MIARILAZA	Juditch	2003-04-30	Femme	Antanimasatsa	0324442269	juditch@gmail.com	Malagasy	Mahajanga	Saint Gabriel	L3	2026-02-17	actif	$2b$10$LtSGA842bjqnSQ9MyIexc.n24M19kZ5lq3905WiVxJ91JtGE4aJEC
1	tinah	dorea	2004-10-05	F	Sotema	0325896471	dorea@gmail.com	Malagasy	Mahajanga	Saint Gabriel	L3	2026-02-17	actif	$2b$10$LtSGA842bjqnSQ9MyIexc.n24M19kZ5lq3905WiVxJ91JtGE4aJEC
3	tinah	dorea	2004-05-01	F	Sotema	0325896472				Saint Gabriel	L3	2026-02-17	actif	$2b$10$LtSGA842bjqnSQ9MyIexc.n24M19kZ5lq3905WiVxJ91JtGE4aJEC
5	Mendy	Aminata	2005-03-15	Femme	Rue 12, Parcelles Assainies	771234567	aminata.mendy@example.com	malagasy	Dakar	Lycée Blaise Diagne	Terminale	2026-03-03	actif	$2b$10$XYZhash123
6	Diop	Moussa	2004-07-22	Homme	Avenue 10, Grand Dakar	772345678	moussa.diop@example.com	malagasy	Thiès	CEM Liberté	3ème	2026-03-03	actif	$2b$10$XYZhash123
7	Fall	Fatou	2006-01-10	Femme	Rue 5, Médina	773456789	fatou.fall@example.com	malagasy	Rufisque	Lycée Seydina Limamou Laye	2nde	2026-03-03	actif	$2b$10$XYZhash123
8	Ndiaye	Cheikh	2005-11-05	Homme	Cité 1000 logements	774567890	cheikh.ndiaye@example.com	malagasy	Saint-Louis	Lycée Ameth Fall	1ère	2026-03-03	actif	$2b$10$XYZhash123
9	Ba	Aïssatou	2004-09-18	Femme	Quartier Escale	775678901	aissatou.ba@example.com	malagasy	Kaolack	CEM Ndoffane	4ème	2026-03-03	actif	$2b$10$XYZhash123
10	Sow	Ibrahima	2006-05-30	Homme	Rue 15, HLM	776789012	ibrahima.sow@example.com	malagasy	Ziguinchor	Lycée Djignabo	2nde	2026-03-03	actif	$2b$10$XYZhash123
11	Diallo	Mariama 	2005-08-12	Femme	Avenue 3, Point E	777890123	mariama.diallo@example.com	malagasy	Tambacounda	CEM Gueule Tapée	3ème	2026-03-03	actif	$2b$10$XYZhash123
12	Gueye	Ousmane	2004-12-25	Homme	Rue 8, Fass	778901234	ousmane.gueye@example.com	malagasy	Mbour	Lycée Malick Sy	Terminale	2026-03-03	actif	$2b$10$XYZhash123
13	Ndao	Khady	2006-02-14	Femme	Cité Keur Gorgui	779012345	khady.ndao@example.com	malagasy	Fatick	CEM Fatick Centre	4ème	2026-03-03	actif	$2b$10$XYZhash123
14	Sarr	Mamadou	2005-06-08	Homme	Quartier Sicap	780123456	mamadou.sarr@example.com	malagasy	Kolda	Lycée Technique	1ère	2026-03-03	actif	$2b$10$XYZhash123
15	Diatta	Bineta	2004-04-20	Femme	Rue 20, Ouakam	781234567	bineta.diatta@example.com	malagasy	Sédhiou	CEM Sédhiou	3ème	2026-03-03	actif	$2b$10$XYZhash123
16	Sy	Abdoulaye	2006-10-03	Homme	Avenue 7, Mermoz	782345678	abdoulaye.sy@example.com	malagasy	Matam	Lycée Technique Matam	2nde	2026-03-03	actif	$2b$10$XYZhash123
17	Camara	Ramatoulaye	2005-01-28	Femme	Rue 11, Grand Yoff	783456789	ramatoulaye.camara@example.com	malagasy	Kédougou	CEM Kédougou	3ème	2026-03-03	actif	$2b$10$XYZhash123
18	Thiam	Boubacar	2004-08-16	Homme	Cité SIPRES	784567890	boubacar.thiam@example.com	malagasy	Louga	Lycée Ibrahima Thiaw	Terminale	2026-03-03	actif	$2b$10$XYZhash123
19	Kane	Ndèye	2006-03-09	Femme	Quartier Ngor	785678901	ndeye.kane@example.com	malagasy	Linguère	CEM Linguère	4ème	2026-03-03	actif	$2b$10$XYZhash123
20	Cissé	Alioune	2005-12-01	Homme	Rue 6, Fann	786789012	alioune.cisse@example.com	malagasy	Bambey	Lycée Agricole	1ère	2026-03-03	actif	$2b$10$XYZhash123
21	Traoré	Awa	2004-07-14	Femme	Avenue 12, Sacré-Cœur	787890123	awa.traore@example.com	malagasy	Tivaouane	CEM Tivaouane	3ème	2026-03-03	actif	$2b$10$XYZhash123
22	Dieng	Serigne	2006-09-22	Homme	Cité OCP	788901234	serigne.dieng@example.com	malagasy	Mbacké	Lycée Serigne Babacar Sy	2nde	2026-03-03	actif	$2b$10$XYZhash123
23	Lo	Mame	2005-05-17	Femme	Rue 9, Dieuppeul	789012345	mame.lo@example.com	malagasy	Guédiawaye	CEM Guédiawaye	3ème	2026-03-03	actif	$2b$10$XYZhash123
24	Thiaw	Papa	2004-11-30	Homme	Quartier Cambérène	790123456	papa.thiaw@example.com	malagasy	Rufisque	Lycée Technique Rufisque	Terminale	2026-03-03	actif	$2b$10$XYZhash123
25	Seck	Aminata	2006-04-25	Femme	Avenue 5, Liberté 6	791234567	aminata.seck@example.com	malagasy	Pikine	CEM Pikine	4ème	2026-03-03	actif	$2b$10$XYZhash123
26	Sall	Demba 	2005-02-19	Homme	Rue 14, Hann	792345678	demba.sall@example.com	malagasy	Thiès	Lycée Technique Thiès	1ère	2026-03-03	actif	$2b$10$XYZhash123
27	Bâ 	Coumba 	2004-06-11	Femme	Cité Asecna	793456789	coumba.ba@example.com	malagasy	Kaolack 	CEM Kaolack Nord 	3ème 	2026-03-03	actif	$2b$10$XYZhash123
28	Ndoye	Lamine	2006-08-07	Homme	Quartier Yembeul	794567890	lamine.ndoye@example.com	malagasy	Ziguinchor	Lycée Technique Ziguinchor	2nde	2026-03-03	actif	$2b$10$XYZhash123
29	Sène	Ouleymatou	2005-10-23	Femme	Rue 7, Sam Notaire	795678901	ouleymatou.sene@example.com	malagasy	Mbour	CEM Mbour	3ème	2026-03-03	actif	$2b$10$XYZhash123
30	Faye	Malick	2004-03-16	Homme	Avenue 9, Virage	796789012	malick.faye@example.com	malagasy	Fatick	Lycée Technique Fatick	Terminale	2026-03-03	actif	$2b$10$XYZhash123
31	Diouf	Sophie	2006-07-29	Femme	Cité Keur Massar	797890123	sophie.diouf@example.com	malagasy	Kolda	CEM Kolda	4ème	2026-03-03	actif	$2b$10$XYZhash123
32	Gning	Abdou	2005-04-12	Homme	Rue 13, Thiaroye	798901234	abdou.gning@example.com	malagasy	Sédhiou	Lycée Technique Sédhiou	1ère	2026-03-03	actif	$2b$10$XYZhash123
33	Diagne	Rokhaya	2004-09-05	Femme	Quartier Wakhinane	799012345	rokhaya.diagne@example.com	malagasy	Matam	CEM Matam	3ème	2026-03-03	actif	$2b$10$XYZhash123
34	Deme	Ibou	2006-01-18	Homme	Avenue 11, Ndiareme	800123456	ibou.deme@example.com	malagasy	Kédougou	CEM Kédougou Centre	2nde	2026-03-03	actif	$2b$10$XYZhash123
35	Niasse	Raby	2005-11-21	Femme	Rue 4, Colobane	801234567	raby.niasse@example.com	malagasy	Louga	CEM Louga	3ème	2026-03-03	actif	$2b$10$XYZhash123
36	Diakhaté	Cheikh Tidiane	2004-05-08	Homme	Cité Dahra	802345678	cheikh.diakhate@example.com	malagasy	Linguère	Lycée Technique Linguère	Terminale	2026-03-03	actif	$2b$10$XYZhash123
37	Sagna 	Aby 	2006-12-13	Femme	Quartier Golf Sud	803456789	aby.sagna@example.com	malagasy	Bambey 	CEM Bambey 	4ème 	2026-03-03	actif	$2b$10$XYZhash123
38	Sarr	Papa Malick	2005-07-26	Homme	Rue 16, Darou	804567890	papamalick.sarr@example.com	malagasy	Tivaouane	Lycée Technique Tivaouane	1ère	2026-03-03	actif	$2b$10$XYZhash123
39	Diop	Marième	2004-02-03	Femme	Avenue 8, Keur Massar	805678901	marieme.diop@example.com	malagasy	Mbacké	CEM Mbacké	3ème	2026-03-03	actif	$2b$10$XYZhash123
40	Fall	Babacar	2006-06-19	Homme	Cité Millionnaire	806789012	babacar.fall@example.com	malagasy	Guédiawaye	Lycée Technique Guédiawaye	2nde	2026-03-03	actif	$2b$10$XYZhash123
41	Ndiaye	Aminata	2005-09-11	Femme	Rue 10, Yeumbeul	807890123	aminata.ndiaye2@example.com	malagasy	Pikine	CEM Pikine Banlieue	3ème	2026-03-03	actif	$2b$10$XYZhash123
42	Ba	Mouhamed	2004-10-27	Homme	Quartier Walo	808901234	mouhamed.ba@example.com	malagasy	Thiès	CEM Thiès Ouest	3ème	2026-03-03	actif	$2b$10$XYZhash123
43	Sow	Fatoumata	2006-03-24	Femme	Avenue 6, Mamelles	809012345	fatoumata.sow@example.com	malagasy	Kaolack	Lycée Technique Kaolack	2nde	2026-03-03	actif	$2b$10$XYZhash123
44	Diallo	Alpha	2005-08-31	Homme	Rue 17, Patte d'Oie	810123456	alpha.diallo@example.com	malagasy	Ziguinchor	CEM Ziguinchor	3ème	2026-03-03	actif	$2b$10$XYZhash123
45	Gueye	Aminata	2004-12-06	Femme	Cité Aicha	811234567	aminata.gueye@example.com	malagasy	Mbour	Lycée Technique Mbour	Terminale	2026-03-03	actif	$2b$10$XYZhash123
46	Ndao	Bassirou	2006-05-15	Homme	Quartier Ndiarème	812345678	bassirou.ndao@example.com	malagasy	Fatick	CEM Fatick Sud	4ème	2026-03-03	actif	$2b$10$XYZhash123
47	Sarr	Ndèye Fatou	2005-01-09	Femme	Rue 18, Keur Gui	813456789	ndeyefatou.sarr@example.com	malagasy	Kolda	CEM Kolda Centre	3ème	2026-03-03	actif	$2b$10$XYZhash123
48	Diatta	Saliou	2004-04-02	Homme	Avenue 13, Fann Hock	814567890	saliou.diatta@example.com	malagasy	Sédhiou	CEM Sédhiou Nord	3ème	2026-03-03	actif	$2b$10$XYZhash123
49	Sy	Aissata	2006-11-17	Femme	Cité Keur Bana	815678901	aissata.sy@example.com	malagasy	Matam	CEM Matam Centre	4ème	2026-03-03	actif	$2b$10$XYZhash123
50	Camara	Mouctar	2005-06-24	Homme	Rue 19, Thiaroye Gare	816789012	mouctar.camara@example.com	malagasy	Kédougou	CEM Kédougou Sud	3ème	2026-03-03	actif	$2b$10$XYZhash123
51	Thiam	Oumou	2004-08-21	Femme	Quartier Ndiareme Limamoulaye	817890123	oumou.thiam@example.com	malagasy	Louga	CEM Louga Nord	3ème	2026-03-03	actif	$2b$10$XYZhash123
52	Kane	Boubou	2006-02-28	Homme	Avenue 14, Diamalaye	818901234	boubou.kane@example.com	malagasy	Linguère	CEM Linguère Centre	2nde	2026-03-03	actif	$2b$10$XYZhash123
53	Cissé	Mariam	2005-10-14	Femme	Rue 21, Keur Massar Nord	819012345	mariam.cisse@example.com	malagasy	Bambey	CEM Bambey Centre	3ème	2026-03-03	actif	$2b$10$XYZhash123
54	Traoré	Seydou	2004-07-07	Homme	Cité Sogefiha	820123456	seydou.traore@example.com	malagasy	Tivaouane	CEM Tivaouane Nord	3ème	2026-03-03	actif	$2b$10$XYZhash123
\.


--
-- TOC entry 5006 (class 0 OID 16407)
-- Dependencies: 221
-- Data for Name: attribution_salle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attribution_salle (id, id_groupe, date_cours, id_salle) FROM stdin;
\.


--
-- TOC entry 5008 (class 0 OID 16411)
-- Dependencies: 223
-- Data for Name: categorie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorie (id, nom_categorie, min_age, max_age) FROM stdin;
1	Précoce	3	6
2	Enfant	8	11
4	Adulte	18	89
3	Adolescent	12	17
\.


--
-- TOC entry 5010 (class 0 OID 16415)
-- Dependencies: 225
-- Data for Name: creneau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creneau (id, id_horaire_cours, jour_semaine, heure_debut, heure_fin) FROM stdin;
1	3	{lundi,mardi,mercredi,jeudi,vendredi}	08:00:00	11:00:00
2	4	{lundi,mardi,mercredi,jeudi,vendredi}	15:00:00	18:00:00
3	7	{lundi,mardi,jeudi}	17:00:00	18:00:00
\.


--
-- TOC entry 5012 (class 0 OID 16423)
-- Dependencies: 227
-- Data for Name: employe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employe (id, nom, prenom, age, adresse, tel, mot_passe, date_creation, email, is_active, deactivated_at, deactivated_by, role) FROM stdin;
3	tina	dorea	30	Sotema	0341234567	$2b$10$04NbXg9BoiTBAs7HGhlqoui7onox9BMakWrjyJpTFQRVfpkiWzBAa	2025-11-04 17:32:55.930466	tinahdorea@gmail.com	t	\N	\N	Admin
2	Tokys	jerrys	25	Sotema	0325896471	$2b$10$04NbXg9BoiTBAs7HGhlqoui7onox9BMakWrjyJpTFQRVfpkiWzBAa	2025-10-25 16:44:31.615915	toky@gmail.com	t	\N	\N	Admin
6	IRATA	Andry Nandrandraiana	25	Sotema	0321654987	$2b$10$6JTwrgNE0H4KK3zIBIFhVeNDlAYYSVqC2bapc035rWi4ofsQrqetC	2026-02-28 10:34:46.792388	irata@gmail.com	t	\N	\N	Professeurs
4	toky	jerrys	23	sotema	0325689741	$2b$10$6JTwrgNE0H4KK3zIBIFhVeNDlAYYSVqC2bapc035rWi4ofsQrqetC	2025-12-12 16:41:52.876033	jerrys@gmail.com	t	\N	\N	Professeurs
1	tinah	dorea	21	Sotema	0324442269	$2b$10$yvkY1oRfuxVNvrGz10tEP.YCaL5vHThrVhBfqsF3/ad9tA/dfIu6a	2025-10-24 17:36:44.301241	tdorea@gmail.com	t	\N	\N	Pédagogie
5	Shania	Amara	21	Mahabibo	0325869855	$2b$10$6JTwrgNE0H4KK3zIBIFhVeNDlAYYSVqC2bapc035rWi4ofsQrqetC	2026-01-10 01:54:58.034594	shania@gmail.com	t	\N	\N	Professeurs
\.


--
-- TOC entry 5014 (class 0 OID 16431)
-- Dependencies: 229
-- Data for Name: examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examen (id, id_inscription, etat_inscription, auto_inscription, verification) FROM stdin;
2	2	t	f	f
1	1	t	t	t
\.


--
-- TOC entry 5016 (class 0 OID 16435)
-- Dependencies: 231
-- Data for Name: groupe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groupe (id, nom_groupe, id_professeur, date_creation, id_creneau) FROM stdin;
3	G1 A1 CI	2	2026-03-03	2
4	G2 A1 CI	1	2026-03-03	1
2	G1 B1 CI 	2	2026-03-03	1
5	G2 B2 CI 	1	2026-03-03	1
\.


--
-- TOC entry 5018 (class 0 OID 16440)
-- Dependencies: 233
-- Data for Name: horaire_cours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horaire_cours (id, id_niveau, id_categorie, duree_heures, duree_semaines, id_type_cours) FROM stdin;
4	{6,7,8,9,10}	4	30	2	2
5	{2,3,4,12,5,11,13,1}	4	30	5	3
7	{1,2,3,4,5,11,12,13}	2	30	5	8
3	{1,2,3,4,5,11,12,13}	4	30	2	2
8	{1,4,2,3,11,5,12,13}	4	24	4	4
6	{10,9,8,7,6}	4	30	5	3
\.


--
-- TOC entry 5020 (class 0 OID 16450)
-- Dependencies: 235
-- Data for Name: inscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscription (id, id_apprenant, id_employe, id_session, id_motivation, num_carte, ticket, etat_inscription, date_inscription, id_niveau, id_categorie, id_creneau, id_groupe, validation_examen, note) FROM stdin;
2	9	\N	20	\N	2358	\N	inscription	2026-03-03 05:54:07.964484	1	4	1	\N	\N	\N
4	50	\N	20	\N	2056	\N	inscription	2026-03-03 09:43:24.505506	1	4	1	\N	\N	\N
5	20	\N	20	\N	2356	\N	inscription	2026-03-03 09:48:21.188552	3	4	1	\N	\N	\N
8	34	\N	1	\N	5689	\N	inscription	2026-03-03 10:03:01.572178	4	4	1	\N	\N	\N
9	9	\N	1	\N	2356	\N	inscription	2026-03-03 10:05:36.43937	2	4	1	\N	\N	\N
10	50	\N	1	\N	2036	\N	inscription	2026-03-03 10:08:42.027022	2	4	1	\N	\N	\N
11	33	\N	1	\N	2356	\N	inscription	2026-03-03 10:13:19.458389	2	4	1	\N	\N	\N
12	2	\N	1	\N	2356	\N	inscription	2026-03-03 10:14:32.825104	11	4	1	\N	\N	\N
1	2	\N	20	\N	2036	\N	inscription	2026-03-02 23:32:09.478645	5	4	1	\N	\N	\N
6	34	\N	20	\N	5689	\N	inscription	2026-03-03 10:01:21.799638	3	4	1	2	\N	\N
3	33	\N	20	\N	2056	\N	inscription	2026-03-03 05:59:05.333021	1	4	1	\N	\N	\N
13	2	\N	13	1	2036	\N	inscription	2026-03-03 10:24:31.968161	21	4	2	\N	\N	\N
14	50	\N	13	2	2356	\N	inscription	2026-03-03 17:29:19.322417	13	4	1	\N	\N	\N
15	9	\N	13	1	2356	\N	inscription	2026-03-03 17:30:43.615703	11	\N	1	\N	\N	\N
\.


--
-- TOC entry 5022 (class 0 OID 16460)
-- Dependencies: 237
-- Data for Name: motivation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.motivation (id, nom_motivation) FROM stdin;
1	Intéressé par la langue française
2	Besoin professionnel
3	Préparation à un voyage
4	Études universitaires
6	Évolution de carrière
7	Préparation à un examen officiel
8	Exigence professionnelle
10	Travail
12	Edute
\.


--
-- TOC entry 5024 (class 0 OID 16464)
-- Dependencies: 239
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
20	C1	1
21	B1	1
22	B1	2
\.


--
-- TOC entry 5026 (class 0 OID 16469)
-- Dependencies: 241
-- Data for Name: presence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presence (id, id_inscription, id_groupe, date_cours, est_present, remarque, id_employe_saisie, date_saisie) FROM stdin;
\.


--
-- TOC entry 5028 (class 0 OID 16477)
-- Dependencies: 243
-- Data for Name: professeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professeur (id, id_employe, specialite_niveaux) FROM stdin;
1	4	{}
2	5	{}
\.


--
-- TOC entry 5030 (class 0 OID 16484)
-- Dependencies: 245
-- Data for Name: salle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salle (id, nom_salle, capacite_max) FROM stdin;
2	Salle A	20
4	salle 5	15
5	salle 4	20
3	Salle 1	5
6	salle 2	5
7	salle 3	5
8	salle 6	5
9	salle 7	5
\.


--
-- TOC entry 5032 (class 0 OID 16488)
-- Dependencies: 247
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam, nom_session, duree_cours) FROM stdin;
7	Avril	2026	1	2026-04-04	2026-04-09	2026-06-14	2026-06-19	\N	0
12	février	2026	1	2026-01-31	2026-02-02	2026-02-27	2026-02-27	session fevrier	0
8	juillet	2026	\N	2026-06-30	2026-07-04	2026-08-19	2026-08-24	\N	30
10	janvier	2027	3	2027-01-08	2027-01-13	2027-03-23	2027-03-28	\N	30
11	avril	2027	2	2027-03-30	2027-04-03	2027-06-08	2027-06-13	\N	30
1	octobre	2025	2	2025-10-27	2025-11-03	2025-11-14	\N	session Octobre Cours Intensifs	30
3	mars	2025	2	2025-03-15	2025-03-25	2025-04-07	\N	session mars Cours Intensifs	30
2	janvier	2025	2	2025-01-20	2025-01-27	2025-02-07	\N	session janvier Cours Intensifs	30
5	novembre	2025	2	2025-11-24	2025-12-01	2025-12-12	\N	session novembre Cours Intensifs	30
14	mai	2025	2	2025-05-16	2025-05-19	2025-06-02	\N	session mai Cours Intensifs	30
15	avril	2025	2	2025-04-22	2025-04-28	2025-05-12	\N	session avril Cours Intensifs	30
16	février	2025	2	2025-02-17	2025-02-24	2025-03-07	\N	session février Cours Intensifs	30
17	juin	2025	2	2025-06-23	2025-06-30	2025-07-11	\N	session juin Cours Intensifs	30
18	juillet	2025	2	2025-07-21	2025-07-28	2025-08-08	\N	session juillet Cours Intensifs	30
19	août	2025	2	2025-08-18	2025-08-25	2025-09-15	\N	session août Cours Intensifs	30
20	septembre	2025	2	2025-09-22	2025-09-29	2025-10-17	\N	session septembre Cours Intensifs	30
9	octobre	2026	\N	2026-09-24	2026-09-30	2026-12-14	2026-12-19	\N	30
6	janvier	2026	\N	2026-01-14	2026-01-19	2026-03-19	2026-03-24	\N	30
21	novembre	2025	4	2025-10-10	2025-10-19	2025-11-12	2025-11-17	session novembre Prepa TP	24
13	février	2026	2	2026-02-15	2026-02-22	2026-03-05	\N	session février cours intensif	30
\.


--
-- TOC entry 5034 (class 0 OID 16493)
-- Dependencies: 249
-- Data for Name: test_niveau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_niveau (id, date_test, nom, prenom, id_type_cours, po, pe, niveau_d, remarque, id_employe) FROM stdin;
\.


--
-- TOC entry 5036 (class 0 OID 16499)
-- Dependencies: 251
-- Data for Name: type_cours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_cours (id, id_type_service, nom_type_cours) FROM stdin;
1	1	Cours régulier
2	1	Cours Intensif
3	1	Cours Extensifs
4	2	Prepa TP
8	2	Prepa Prim'
9	2	Prepa junior
\.


--
-- TOC entry 5038 (class 0 OID 16503)
-- Dependencies: 253
-- Data for Name: type_service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_service (id, nom_service, libelle) FROM stdin;
2	Prepa	Préparation aux examens DELF/DALF
1	Renforcements	Cours de renforcement linguistique pour tous niveaux
11	Vacance	cours de vacance pour renforce votre français
\.


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 218
-- Name: a_propos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.a_propos_id_seq', 1, true);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 220
-- Name: apprenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.apprenant_id_seq', 54, true);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 222
-- Name: attribution_salle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attribution_salle_id_seq', 1, false);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 224
-- Name: categorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorie_id_seq', 5, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 226
-- Name: creneau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.creneau_id_seq', 3, true);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 228
-- Name: employe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employe_id_seq', 6, true);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 230
-- Name: examen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examen_id_seq', 2, true);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 232
-- Name: groupe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groupe_id_seq', 5, true);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 234
-- Name: horaire_cours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horaire_cours_id_seq', 8, true);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 236
-- Name: inscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscription_id_seq', 15, true);


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 238
-- Name: motivation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.motivation_id_seq', 12, true);


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 240
-- Name: niveau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.niveau_id_seq', 22, true);


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 242
-- Name: presence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presence_id_seq', 1, false);


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 244
-- Name: professeur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professeur_id_seq', 2, true);


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 246
-- Name: salle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salle_id_seq', 9, true);


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 248
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_id_seq', 21, true);


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 250
-- Name: test_niveau_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_niveau_id_seq', 1, false);


--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 252
-- Name: type_cours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_cours_id_seq', 9, true);


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 254
-- Name: type_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_service_id_seq', 15, true);


--
-- TOC entry 4776 (class 2606 OID 16529)
-- Name: a_propos a_propos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.a_propos
    ADD CONSTRAINT a_propos_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 16531)
-- Name: apprenant apprenant_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_email_key UNIQUE (email);


--
-- TOC entry 4782 (class 2606 OID 16533)
-- Name: apprenant apprenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 16535)
-- Name: attribution_salle attribution_salle_id_groupe_date_cours_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_groupe_date_cours_key UNIQUE (id_groupe, date_cours);


--
-- TOC entry 4789 (class 2606 OID 16537)
-- Name: attribution_salle attribution_salle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 16539)
-- Name: categorie categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16541)
-- Name: creneau creneau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau
    ADD CONSTRAINT creneau_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16543)
-- Name: employe employe_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_email_key UNIQUE (email);


--
-- TOC entry 4798 (class 2606 OID 16545)
-- Name: employe employe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16547)
-- Name: examen examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT examen_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16549)
-- Name: groupe groupe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16551)
-- Name: horaire_cours horaire_cours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours
    ADD CONSTRAINT horaire_cours_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16553)
-- Name: inscription inscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16555)
-- Name: motivation motivation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivation
    ADD CONSTRAINT motivation_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16557)
-- Name: niveau niveau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveau
    ADD CONSTRAINT niveau_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16559)
-- Name: presence presence_id_inscription_date_cours_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_inscription_date_cours_key UNIQUE (id_inscription, date_cours);


--
-- TOC entry 4820 (class 2606 OID 16561)
-- Name: presence presence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 16563)
-- Name: professeur professeur_id_employe_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_id_employe_key UNIQUE (id_employe);


--
-- TOC entry 4824 (class 2606 OID 16565)
-- Name: professeur professeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16567)
-- Name: salle salle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salle
    ADD CONSTRAINT salle_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16569)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16571)
-- Name: test_niveau test_niveau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16573)
-- Name: type_cours type_cours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours
    ADD CONSTRAINT type_cours_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16575)
-- Name: type_service type_service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_service
    ADD CONSTRAINT type_service_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 1259 OID 16576)
-- Name: idx_a_propos_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_a_propos_email ON public.a_propos USING btree (email);


--
-- TOC entry 4778 (class 1259 OID 16577)
-- Name: idx_a_propos_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_a_propos_tel ON public.a_propos USING btree (tel);


--
-- TOC entry 4783 (class 1259 OID 16696)
-- Name: idx_apprenant_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_apprenant_email ON public.apprenant USING btree (email);


--
-- TOC entry 4784 (class 1259 OID 16698)
-- Name: idx_apprenant_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_apprenant_statut ON public.apprenant USING btree (statut);


--
-- TOC entry 4785 (class 1259 OID 16697)
-- Name: idx_apprenant_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_apprenant_tel ON public.apprenant USING btree (tel);


--
-- TOC entry 4790 (class 1259 OID 16578)
-- Name: idx_attribution_salle_groupe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attribution_salle_groupe ON public.attribution_salle USING btree (id_groupe);


--
-- TOC entry 4799 (class 1259 OID 16579)
-- Name: idx_employe_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_is_active ON public.employe USING btree (is_active);


--
-- TOC entry 4806 (class 1259 OID 16580)
-- Name: idx_inscription_apprenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_apprenant ON public.inscription USING btree (id_apprenant);


--
-- TOC entry 4807 (class 1259 OID 16581)
-- Name: idx_inscription_creneau; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_creneau ON public.inscription USING btree (id_creneau) WHERE (id_creneau IS NOT NULL);


--
-- TOC entry 4808 (class 1259 OID 16582)
-- Name: idx_inscription_groupe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_groupe ON public.inscription USING btree (id_groupe) WHERE (id_groupe IS NOT NULL);


--
-- TOC entry 4809 (class 1259 OID 16583)
-- Name: idx_inscription_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscription_session ON public.inscription USING btree (id_session);


--
-- TOC entry 4816 (class 1259 OID 16584)
-- Name: idx_presence_groupe_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presence_groupe_date ON public.presence USING btree (id_groupe, date_cours);


--
-- TOC entry 4835 (class 2606 OID 16585)
-- Name: attribution_salle attribution_salle_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 16590)
-- Name: attribution_salle attribution_salle_id_salle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribution_salle
    ADD CONSTRAINT attribution_salle_id_salle_fkey FOREIGN KEY (id_salle) REFERENCES public.salle(id);


--
-- TOC entry 4837 (class 2606 OID 16595)
-- Name: creneau creneau_id_horaire_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creneau
    ADD CONSTRAINT creneau_id_horaire_cours_fkey FOREIGN KEY (id_horaire_cours) REFERENCES public.horaire_cours(id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 16600)
-- Name: employe fk_deactivated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT fk_deactivated_by FOREIGN KEY (deactivated_by) REFERENCES public.employe(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4839 (class 2606 OID 16605)
-- Name: groupe groupe_id_creneau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_id_creneau_fkey FOREIGN KEY (id_creneau) REFERENCES public.creneau(id) ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 16610)
-- Name: groupe groupe_id_professeur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupe
    ADD CONSTRAINT groupe_id_professeur_fkey FOREIGN KEY (id_professeur) REFERENCES public.professeur(id) ON DELETE RESTRICT;


--
-- TOC entry 4841 (class 2606 OID 16615)
-- Name: horaire_cours horaire_cours_id_type_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horaire_cours
    ADD CONSTRAINT horaire_cours_id_type_cours_fkey FOREIGN KEY (id_type_cours) REFERENCES public.type_cours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4842 (class 2606 OID 16620)
-- Name: inscription inscription_id_apprenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_apprenant_fkey FOREIGN KEY (id_apprenant) REFERENCES public.apprenant(id) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 16625)
-- Name: inscription inscription_id_creneau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_creneau_fkey FOREIGN KEY (id_creneau) REFERENCES public.creneau(id) ON DELETE SET NULL;


--
-- TOC entry 4844 (class 2606 OID 16630)
-- Name: inscription inscription_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON DELETE SET NULL;


--
-- TOC entry 4845 (class 2606 OID 16635)
-- Name: inscription inscription_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE SET NULL;


--
-- TOC entry 4846 (class 2606 OID 16640)
-- Name: inscription inscription_id_motivation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_motivation_fkey FOREIGN KEY (id_motivation) REFERENCES public.motivation(id) ON DELETE SET NULL;


--
-- TOC entry 4847 (class 2606 OID 16645)
-- Name: inscription inscription_id_niveau_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_niveau_fkey FOREIGN KEY (id_niveau) REFERENCES public.niveau(id) ON DELETE SET NULL;


--
-- TOC entry 4848 (class 2606 OID 16650)
-- Name: inscription inscription_id_session_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_id_session_fkey FOREIGN KEY (id_session) REFERENCES public.session(id) ON DELETE RESTRICT;


--
-- TOC entry 4849 (class 2606 OID 16655)
-- Name: presence presence_id_employe_saisie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_employe_saisie_fkey FOREIGN KEY (id_employe_saisie) REFERENCES public.employe(id);


--
-- TOC entry 4850 (class 2606 OID 16660)
-- Name: presence presence_id_groupe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_groupe_fkey FOREIGN KEY (id_groupe) REFERENCES public.groupe(id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 16665)
-- Name: presence presence_id_inscription_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_id_inscription_fkey FOREIGN KEY (id_inscription) REFERENCES public.inscription(id) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 16670)
-- Name: professeur professeur_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur
    ADD CONSTRAINT professeur_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 16675)
-- Name: session session_id_type_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_id_type_cours_fkey FOREIGN KEY (id_type_cours) REFERENCES public.type_cours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4854 (class 2606 OID 16680)
-- Name: test_niveau test_niveau_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employe(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4855 (class 2606 OID 16685)
-- Name: test_niveau test_niveau_id_type_cours_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_niveau
    ADD CONSTRAINT test_niveau_id_type_cours_fkey FOREIGN KEY (id_type_cours) REFERENCES public.type_cours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4856 (class 2606 OID 16690)
-- Name: type_cours type_cours_id_type_service_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_cours
    ADD CONSTRAINT type_cours_id_type_service_fkey FOREIGN KEY (id_type_service) REFERENCES public.type_service(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-03-03 21:03:14

--
-- PostgreSQL database dump complete
--

