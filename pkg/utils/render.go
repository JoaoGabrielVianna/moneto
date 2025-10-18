package utils

import (
	"fmt"

	"github.com/joaogabriel/moneto/pkg/fonts"
)

func Render(text string) {
	lines := make([]string, 7)

	for _, char := range text {
		if glyph, ok := fonts.AnsiShadow[char]; ok {
			for i := 0; i < 7; i++ {
				lines[i] += glyph[i]
			}
		} else {
			for i := 0; i < 7; i++ {
				lines[i] += "        "
			}
		}
	}

	for _, line := range lines {
		fmt.Println(line)
	}
}
