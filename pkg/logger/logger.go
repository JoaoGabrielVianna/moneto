package logger

import (
	"fmt"
	"time"
)

var (
	ColorReset = "\033[0m"

	// Regular Colors
	ColorRed    = "\033[31m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorCyan   = "\033[36m"

	// Bright Colors
	ColorBrightBlack = "\033[90m"

	// Text styles
	TextBold = "\033[1m"
)

type Logger struct {
	origin string
}

func Get(o string) *Logger {
	return &Logger{origin: o}
}

// Métodos públicos
func (l *Logger) Error(msg string, v ...any)   { l.log("ERROR", ColorRed, msg, v...) }
func (l *Logger) Success(msg string, v ...any) { l.log("SUCCESS", ColorGreen, msg, v...) }
func (l *Logger) Info(msg string, v ...any)    { l.log("INFO", ColorCyan, msg, v...) }
func (l *Logger) Warn(msg string, v ...any)    { l.log("WARN", ColorYellow, msg, v...) }
func (l *Logger) Debug(msg string, v ...any)   { l.log("DEBUG", ColorBrightBlack, msg, v...) }

// log interno
func (l *Logger) log(level, color, msg string, v ...any) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	formatted := msg
	if len(v) > 0 {
		formatted = fmt.Sprintf(msg, v...)
	}

	// maior comprimento incluindo os colchetes e o espaço final
	const maxLen = 10

	// monta a string com padding depois do colchete
	levelWithBrackets := fmt.Sprintf("[%s]", level)
	paddedLevel := fmt.Sprintf("%-*s", maxLen, levelWithBrackets)

	fmt.Printf("%s[%s]%s %s%s%s[%s] %s\n",
		TextBold, timestamp, ColorReset,
		color, paddedLevel, ColorReset,
		l.origin,
		formatted,
	)
}
