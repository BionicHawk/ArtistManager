package datastructs

type Result struct {
	Error   bool    `json:"error"`
	Title   string  `json:"title"`
	Message *string `json:"message"`
}
