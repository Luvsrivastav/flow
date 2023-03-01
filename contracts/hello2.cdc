pub contract hello2 {
     pub var greeting: String

     pub fun changegreeting(newgreeting : String){
      
          self.greeting = newgreeting;
     }
    
    init()
    {
        self.greeting ="Hello"
    }
}