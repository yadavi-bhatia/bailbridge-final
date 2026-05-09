import { Router } from "express";

const router = Router();

const NGOS = [
  {
    id: "1",
    name: "Jan Sahas",
    focus: "Undertrial support, mental health",
    location: "Bengaluru / National",
    contact: "1800-xxxx-xxxx",
    email: "info@jansahas.com",
    website: "https://jansahas.org",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    id: "2",
    name: "CHRI (Commonwealth Human Rights Initiative)",
    focus: "Police reforms, legal aid",
    location: "New Delhi / Remote",
    contact: "info@humanrightsinitiative.org",
    email: "info@humanrightsinitiative.org",
    website: "https://www.humanrightsinitiative.org",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    id: "3",
    name: "Alternative Law Forum (ALF)",
    focus: "Labor, marginalized communities",
    location: "Vasanth Nagar, Bengaluru",
    contact: "080-2225-xxxx",
    email: "contact@altlawforum.org",
    website: "https://altlawforum.org",
    lat: 12.9904,
    lng: 77.5937
  }
];

router.get("/ngos", (req, res) => {
  res.json(NGOS);
});

export default router;
