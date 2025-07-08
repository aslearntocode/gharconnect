// Comprehensive search function that works with any vendor structure
export const searchVendors = (vendors: any[], searchQuery: string) => {
  const searchLower = searchQuery.toLowerCase();
  
  return vendors.filter(vendor => {
    // Check vendor name
    if (vendor.name.toLowerCase().includes(searchLower)) return true;
    
    // Check mobile number
    if (vendor.mobile && vendor.mobile.toLowerCase().includes(searchLower)) return true;
    
    // Check area served
    if (vendor.areaServed && Array.isArray(vendor.areaServed)) {
      if (vendor.areaServed.some((area: string) => area.toLowerCase().includes(searchLower))) return true;
    }
    
    // Check building served
    if (vendor.buildingServed && Array.isArray(vendor.buildingServed)) {
      if (vendor.buildingServed.some((building: string) => building.toLowerCase().includes(searchLower))) return true;
    }
    
    // Check services (for service pages)
    if (vendor.services && Array.isArray(vendor.services)) {
      if (vendor.services.some((service: any) => 
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      )) return true;
    }
    
    // Check products (for delivery pages)
    if (vendor.products && Array.isArray(vendor.products)) {
      if (vendor.products.some((product: any) => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )) return true;
    }
    
    return false;
  });
}; 