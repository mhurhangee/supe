export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  
  export const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/")
  }
  
  export const isPdfFile = (file: File): boolean => {
    return file.type === "application/pdf"
  }
  
  export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  export const validateFile = (file: File, acceptedTypes?: string[], maxSize?: number): string | null => {
    if (acceptedTypes && acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type.replace("*", ".*"))
      })
      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${acceptedTypes.join(", ")}`
      }
    }
  
    if (maxSize && file.size > maxSize) {
      return `File size too large. Maximum size: ${formatFileSize(maxSize)}`
    }
  
    return null
  }
  