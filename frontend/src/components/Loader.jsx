const Loader = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin`}></div>
      {message && (
        <p className="text-text-secondary text-sm">{message}</p>
      )}
    </div>
  )
}

export default Loader