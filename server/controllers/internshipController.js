const Job = require("../models/Job");
const Application = require("../models/Application");

// Helper to normalize URL slugs to category names
const formatCategorySlug = (slug = "") => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// GET /api/internships (Filterable, paginated internship catalog)
exports.getInternships = async (req, res, next) => {
  try {
    const {
      category,
      city,
      workMode,
      skill,
      isPaid,
      hasJobOffer,
      isInternational,
      minStipend,
      maxStipend,
      search,
      sort = "latest",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      status: "Published",
      employmentType: "Internship",
    };

    // Filter by workMode (Remote / Hybrid / On-site)
    if (workMode && workMode !== "All") {
      query.workMode = workMode === "Remote" || workMode === "work-from-home" ? "Remote" : workMode;
    }

    // Filter by City
    if (city && city !== "All") {
      const cityQuery = city.replace(/-/g, " ");
      query.$or = [
        { city: { $regex: cityQuery, $options: "i" } },
        { location: { $regex: cityQuery, $options: "i" } },
      ];
    }

    // Filter by Category or Skill Tag
    if (category && category !== "All") {
      const formattedCategory = formatCategorySlug(category);
      const catRegex = new RegExp(formattedCategory, "i");
      query.$or = [
        { category: { $regex: catRegex } },
        { subCategory: { $regex: catRegex } },
        { title: { $regex: catRegex } },
        { requiredSkills: { $in: [catRegex] } },
      ];
    }

    // Filter by specific Skill
    if (skill && skill !== "All") {
      query.requiredSkills = { $in: [new RegExp(skill, "i")] };
    }

    // Filter by Paid status
    if (isPaid !== undefined && isPaid !== "All") {
      if (isPaid === "true" || isPaid === true) {
        query.isPaid = true;
      } else if (isPaid === "false" || isPaid === false) {
        query.isPaid = false;
      }
    }

    // Filter by Job Offer (PPO)
    if (hasJobOffer === "true" || hasJobOffer === true) {
      query.hasJobOffer = true;
    }

    // Filter by International
    if (isInternational === "true" || isInternational === true) {
      query.isInternational = true;
    }

    // Search query (keyword)
    if (search) {
      const sRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: { $regex: sRegex } },
        { description: { $regex: sRegex } },
        { category: { $regex: sRegex } },
        { requiredSkills: { $in: [sRegex] } },
        { location: { $regex: sRegex } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "stipend_high") sortOption = { "salaryRange.min": -1 };
    if (sort === "stipend_low") sortOption = { "salaryRange.min": 1 };
    if (sort === "deadline") sortOption = { deadline: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [total, internships] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .populate("employerId", "companyName logo headquarters website industry")
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    const formattedList = internships.map((int) => {
      const stipendStr =
        int.salaryRange?.min > 0
          ? `₹${int.salaryRange.min.toLocaleString()} / month`
          : int.isPaid ? "Paid Stipend" : "Unpaid / Academic";

      return {
        _id: int._id,
        id: int._id.toString(),
        jobId: int._id.toString(),
        title: int.title,
        company: int.employerId?.companyName || "Partner Employer",
        companyId: int.employerId?._id || "",
        logo: int.employerId?.logo || "",
        location: int.location,
        city: int.city || "Bangalore",
        category: int.category || "Web Development",
        subCategory: int.subCategory || "Full Stack",
        stipend: stipendStr,
        salary: stipendStr,
        duration: "3-6 Months",
        type: "Internship",
        workMode: int.workMode || "Remote",
        isPaid: int.isPaid !== false,
        hasJobOffer: !!int.hasJobOffer,
        isInternational: !!int.isInternational,
        skillsRequired: int.requiredSkills || [],
        postedAt: "Recently Posted",
        createdAt: int.createdAt,
        deadline: int.deadline
          ? new Date(int.deadline).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Open until filled",
        description: int.description,
        responsibilities: int.responsibilities || [],
        openings: int.openings || 1,
        applicantsCount: int.applicantsCount || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedList,
      internships: formattedList,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/internships/categories (Dynamic category & location counts aggregated from database)
exports.getInternshipCategories = async (req, res, next) => {
  try {
    const baseQuery = { status: "Published", employmentType: "Internship" };

    const [
      totalActive,
      workFromHomeCount,
      paidCount,
      withJobOfferCount,
      internationalCount,
      allInternships,
    ] = await Promise.all([
      Job.countDocuments(baseQuery),
      Job.countDocuments({ ...baseQuery, workMode: "Remote" }),
      Job.countDocuments({ ...baseQuery, isPaid: true }),
      Job.countDocuments({ ...baseQuery, hasJobOffer: true }),
      Job.countDocuments({ ...baseQuery, isInternational: true }),
      Job.find(baseQuery).select("category city requiredSkills").lean(),
    ]);

    // Top Cities
    const targetCities = [
      "Bangalore",
      "Delhi",
      "Hyderabad",
      "Mumbai",
      "Chennai",
      "Pune",
      "Kolkata",
      "Jaipur",
      "Gurugram",
      "Noida",
    ];

    const cityCounts = {};
    targetCities.forEach((city) => {
      cityCounts[city] = allInternships.filter(
        (i) => i.city?.toLowerCase() === city.toLowerCase()
      ).length;
    });

    // Top Categories
    const targetCategories = [
      "Web Development",
      "App Development",
      "Software Development",
      "Data Science",
      "Machine Learning",
      "AI",
      "UI/UX Design",
      "Digital Marketing",
      "Content Writing",
      "Graphic Design",
      "HR",
      "Finance",
      "Sales",
      "Business Development",
      "Python",
      "Java",
      "React",
    ];

    const categoryCounts = {};
    targetCategories.forEach((cat) => {
      const catLower = cat.toLowerCase();
      categoryCounts[cat] = allInternships.filter(
        (i) =>
          i.category?.toLowerCase() === catLower ||
          (i.requiredSkills || []).some((s) => s.toLowerCase().includes(catLower))
      ).length;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalActive,
        workFromHomeCount,
        paidCount,
        withJobOfferCount,
        internationalCount,
        cityCounts,
        categoryCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/internships/:id
exports.getInternshipById = async (req, res, next) => {
  try {
    const internship = await Job.findOne({
      _id: req.params.id,
      status: "Published",
    }).populate("employerId", "companyName logo headquarters website industry description");

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship opportunity not found" });
    }

    internship.viewsCount += 1;
    await internship.save();

    return res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    next(error);
  }
};
