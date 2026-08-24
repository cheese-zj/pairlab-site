export type Publication = {
  id: string
  year: number
  venue: string
  citation: string
  url?: string
}

export const publications: Publication[] = [
  {
    "id": "01",
    "year": 2026,
    "venue": "RA-L 2026 + ICRA 2027 (to appear)",
    "citation": "J. Long, D. Liu, W. Cai, I. Manchester, W. Zhi. Safe Policies Post-Training: Constraining Streaming Flow Models for Adapting Learned Robot Trajectory Distributions."
  },
  {
    "id": "02",
    "year": 2026,
    "venue": "IROS 2026, to appear",
    "citation": "Z. Yuan, T. Zhang, M. Johnson-Roberson, W. Zhi. PPReg: Prior-Guided Photometric Registration of 3D Gaussian Splats in Low-Overlap Scenes."
  },
  {
    "id": "03",
    "year": 2026,
    "venue": "IROS 2026, to appear",
    "citation": "H. Tang, T. Zhang, M. Johnson-Roberson, W. Zhi. Bi-Manual Joint Camera Calibration and Scene Representation."
  },
  {
    "id": "04",
    "year": 2026,
    "venue": "IROS 2026, to appear",
    "citation": "Z. Ma, U. Yoo, J. Francis, W. Zhi, J. Ichnowski, J. Oh. SOFTMAP: Sim2Real Soft Robot Forward Modeling via Topological Mesh Alignment and Physics Prior."
  },
  {
    "id": "05",
    "year": 2026,
    "venue": "ICRA 2026",
    "citation": "X. Dong, M. Johnson-Roberson, W. Zhi. Joint Flow Trajectory Optimization For Feasible Robot Motion Generation from Video Demonstrations."
  },
  {
    "id": "06",
    "year": 2026,
    "venue": "ICRA 2026",
    "citation": "H. Tang, T. Zhang, M. Johnson-Roberson, W. Zhi. Bi-Manual Joint Camera Calibration and Scene Representation."
  },
  {
    "id": "07",
    "year": 2026,
    "venue": "ICRA 2026",
    "citation": "W. T. Chu, T. Zhang, M. Johnson-Roberson, W. Zhi. Efficient Construction of Implicit Surface Models From a Single Image for Motion Generation."
  },
  {
    "id": "08",
    "year": 2026,
    "venue": "ICRA 2026",
    "citation": "W. Baron, X. Dong, M. Johnson-Roberson, W. Zhi. Cross-Modal Instructions for Robot Motion Generation."
  },
  {
    "id": "09",
    "year": 2026,
    "venue": "ICRA 2026",
    "citation": "T. Zhang, W. Zhi, J. Mangelson, M. Johnson-Roberson. Infinite leagues under the sea: Photorealistic 3D underwater terrain generation by latent fractal diffusion models."
  },
  {
    "id": "10",
    "year": 2026,
    "venue": "RA-L 2026, ICRA 2026",
    "citation": "H. Wright, W. Zhi, M. Matak, M. Johnson-Roberson, T. Hermans. Robust Bayesian Scene Reconstruction With Retrieval-Augmented Priors for Precise Grasping and Planning."
  },
  {
    "id": "11",
    "year": 2026,
    "venue": "RA-L 2026, ICRA 2026",
    "citation": "H. Cheng, T. Zheng, Z. Ma, T. Zhang, M. Johnson-Roberson, W. Zhi. DOSE3: Diffusion-Based Unified Out-of-Distribution Detection on SO(3) Trajectories"
  },
  {
    "id": "12",
    "year": 2025,
    "venue": "NeurIPS 2025",
    "citation": "W. Zhi, Z. Ma, T. Zhang, M. Johnson-Roberson. From Single Images to Motion Policies via Video-Generation Environment Representations."
  },
  {
    "id": "13",
    "year": 2025,
    "venue": "RA-L 2025 + ICRA 2025",
    "citation": "W. Zhi, H. Tang, T. Zhang, M. Johnson-Roberson. Teaching Periodic Stable Robot Motion Generation via Sketch."
  },
  {
    "id": "14",
    "year": 2025,
    "venue": "RA-L 2025 + ICRA 2025",
    "citation": "T. Zhang, W. Zhi, et al. RecGS: Removing Water Caustic with Recurrent Gaussian Splatting."
  },
  {
    "id": "15",
    "year": 2025,
    "venue": "T-RO 2025 + IROS 2025",
    "citation": "Multi-query Robotic Manipulator Task Sequencing with Gromov-Hausdorff Approximations. F. Sukkar, J. Wakulicz, K. M. B. Lee, W. Zhi, R. Fitch."
  },
  {
    "id": "16",
    "year": 2025,
    "venue": "RA-L 2025 + IROS 2025",
    "citation": "ModCube: Modular, Self-Assembling Cubic Underwater Robot. J. Zheng, et al., W. Zhi, D. Fan."
  },
  {
    "id": "17",
    "year": 2025,
    "venue": "Expert Syst. Appl. 2025",
    "citation": "H. Wang, W. Zhi, G. Batista, R. Chandra. Pedestrian trajectory prediction using goal-driven and dynamics-based deep learning framework. Expert Syst. Appl., 2025."
  },
  {
    "id": "18",
    "year": 2024,
    "venue": "RA-L 2024 + ICRA 2025",
    "citation": "W. Zhi, H. Tang, T. Zhang, M. Johnson-Roberson. Simultaneous Geometry and Pose Estimation of Grasped Objects via 3D Foundation Models."
  },
  {
    "id": "19",
    "year": 2024,
    "venue": "RA-L 2024 + ICRA 2025",
    "citation": "W. Zhi, H. Tang, T. Zhang, M. Johnson-Roberson. Unifying Representation and Calibration with 3D Foundation Models."
  },
  {
    "id": "20",
    "year": 2024,
    "venue": "IROS 2024",
    "citation": "Q. Sun, W. Zhi, T. Zhang, M. Johnson-Roberson. Diagrammatic Instructions to Specify Spatial Objectives and Constraints with Applications to Mobile Base Placement."
  },
  {
    "id": "21",
    "year": 2024,
    "venue": "IROS 2024",
    "citation": "H. Wright, W. Zhi, M. Johnson-Roberson, T. Hermans. V-PRISM: Probabilistic Mapping of Unknown Tabletop Scenes."
  },
  {
    "id": "22",
    "year": 2024,
    "venue": "IROS 2024",
    "citation": "T. Zhang, K. Huang, W. Zhi, M. Johnson-Roberson. DarkGS: Learning Neural Illumination and 3D Gaussians Relighting for Robotic Exploration in the Dark."
  },
  {
    "id": "23",
    "year": 2024,
    "venue": "IROS 2024",
    "citation": "T. Lai, W.Zhi, T. Hermans, F. Ramos. Learning for Kinodynamic Tree Expansion."
  },
  {
    "id": "24",
    "year": 2024,
    "venue": "ICRA 2024",
    "citation": "W. Zhi, T. Zhang, M. Johnson-Roberson. Instructing Robots by Sketching: Learning from Demonstration via Probabilistic Diagrammatic Teaching.",
    "url": "http://arxiv.org/abs/2309.03835"
  },
  {
    "id": "25",
    "year": 2024,
    "venue": "ICRA 2024",
    "citation": "H. Wang, W.Zhi, G. Batista, R. Chandra. Pedestrian Trajectory Prediction Using Dynamics-based Deep Learning."
  },
  {
    "id": "26",
    "year": 2023,
    "venue": "ICRA 2023",
    "citation": "W. Zhi, I. Akinola, K. Van Wyk, N. Ratliff, F. Ramos. Global and Reactive Motion Generation with Geometric Fabric Command Sequences.",
    "url": "https://ieeexplore.ieee.org/document/10160965"
  },
  {
    "id": "27",
    "year": 2022,
    "venue": "ICML 2022",
    "citation": "W. Zhi, T. Lai, L. Ott, E. V. Bonilla, F. Ramos. Learning Efficient and Robust Ordinary Differential Equations via Invertible Neural Networks.",
    "url": "https://proceedings.mlr.press/v162/zhi22a/zhi22a.pdf"
  },
  {
    "id": "28",
    "year": 2022,
    "venue": "L4DC 2022, Best Paper Award",
    "citation": "W. Zhi, T. Lai, L. Ott, F. Ramos. Diffeomorphic Transforms for Generalised Imitation Learning.",
    "url": "https://proceedings.mlr.press/v168/zhi22a/zhi22a.pdf"
  },
  {
    "id": "29",
    "year": 2021,
    "venue": "CORL 2021",
    "citation": "T. Lai, W. Zhi, T. Hermans, F. Ramos. Parallelised Diffeomorphic Sampling-based Motion Planning.",
    "url": "http://arxiv.org/abs/2108.11775"
  },
  {
    "id": "30",
    "year": 2021,
    "venue": "IROS 2021",
    "citation": "W. Zhi, L. Ott, F. Ramos. Probabilistic Trajectory Prediction with Structural Constraints.",
    "url": "https://arxiv.org/abs/2107.041"
  },
  {
    "id": "31",
    "year": 2021,
    "venue": "IROS 2021",
    "citation": "W. Zhi, T. Lai, L. Ott, F. Ramos. Trajectory Generation in New Environments from Past Experiences.",
    "url": "https://ieeexplore.ieee.org/document/9636231/"
  },
  {
    "id": "32",
    "year": 2021,
    "venue": "ICRA 2021",
    "citation": "W. Zhi, T. Lai, L. Ott, F. Ramos. Anticipatory Navigation in Crowds by Probabilistic Prediction of Pedestrian Future Movements.",
    "url": "https://ieeexplore.ieee.org/abstract/document/9561022"
  },
  {
    "id": "33",
    "year": 2019,
    "venue": "CORL 2019",
    "citation": "W. Zhi, L. Ott, F. Ramos Kernel trajectory maps for multi-modal probabilistic motion prediction.",
    "url": "http://proceedings.mlr.press/v100/zhi20a.html"
  },
  {
    "id": "34",
    "year": 2019,
    "venue": "RA-L + IROS 2019",
    "citation": "W. Zhi, R. Senanyake, L. Ott, F. Ramos. Spatiotemporal learning of directional uncertainty in urban environments with kernel recurrent mixture density networks.",
    "url": "https://ieeexplore.ieee.org/abstract/document/8772158"
  },
  {
    "id": "35",
    "year": 2019,
    "venue": "ICRA 2019",
    "citation": "W. Zhi, R. Senanyake, L. Ott, F. Ramos. Continuous Occupancy Map Fusion with Fast Bayesian Hilbert Maps.",
    "url": "https://ieeexplore.ieee.org/abstract/document/8793508/"
  }
]
