export default function getYear(dateString) {
  return dateString
    ? new Date(dateString).getFullYear()
    : new Date().getFullYear();
}
