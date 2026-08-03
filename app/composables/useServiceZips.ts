// composables/useServiceZips.ts  (storefront)
export const SERVICE_ZIP_CODES = [
  // Lakewood Ranch / shared
  '34202', '34211', '34212', '34240',
  // Sarasota County
  '34223', '34228', '34229', '34231', '34232', '34233', '34234', '34235',
  '34236', '34237', '34238', '34239', '34241', '34242', '34275', '34285',
  '34286', '34287', '34288', '34289', '34291', '34292', '34293',
  // Sarasota limited / PO
  '34230', '34249', '34272', '34274', '34276', '34277', '34284', '34290', '34295',
  // Manatee / Bradenton
  '34201', '34203', '34205', '34207', '34208', '34209', '34210', '34215',
  '34216', '34217', '34219', '34221', '34222', '34243', '34251',
  // Manatee limited / PO
  '34204', '34206', '34218', '34220', '34250', '34260', '34264', '34270',
  '34280', '34281', '34282',
] as const

export const useServiceZips = () => {
  const normalizeZip = (zip: string) => zip.replace(/\D/g, '').slice(0, 5)

  const isServiceZip = (zip: string) => {
    const z = normalizeZip(zip)
    return SERVICE_ZIP_CODES.includes(z as any)
  }

  return { SERVICE_ZIP_CODES, normalizeZip, isServiceZip }
}