import { IFilters } from "../interfaces";

export function buildFilterQuery(filters: IFilters) {
  const query: any = {};
  if (!Object.keys(filters).length) return {};

  if (filters.id) {
    query["_id"] = filters.id;
    return query;
  }

  if (filters.colors) {
    query["color"] = { $in: filters.colors };
  }

  if (filters.brands) {
    query["brand"] = { $in: filters.brands };
  }

  if (filters.categories) {
    query["category"] = { $in: filters.categories };
  }

  if (filters.rating) {
    query["rating"] = Number(filters.rating);
  }

  if (filters.priceRange) {
    query["currentPrice"] = {
      $gte: Number(filters.priceRange[0]),
      $lte: Number(filters.priceRange[1]),
    };
  }

  if ("inStock" in filters && filters.inStock === "false") {
    query["stock"] = { $eq: 0 };
  } else {
    query["stock"] = { $gt: 0 };
  }

  if (filters.exclusive && filters.exclusive === "true") {
    query["exclusive"] = true;
  }

  return query;
}

export const removeQueryParam = (param: string, router: any) => {
  const { pathname, query } = router;
  const params = new URLSearchParams(query);
  params.delete(param);
  router.replace({ pathname, query: params.toString() }, undefined);
};
