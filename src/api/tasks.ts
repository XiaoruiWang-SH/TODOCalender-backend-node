import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  console.log("进入tasks路由");
  next();
});

router.post("all", (req, res, next) => {
    const { date, startDate, endDate } = req.body;

    
    
    // if (date != null) {
    //     List<Task> tasks = taskService.findByDate(date);
    //     if (tasks.isEmpty()) {
    //         return ResponseEntity.ok(new ArrayList<>());
    //     }
    //     return ResponseEntity.ok(tasks);
    // }
    // if (startDate != null && endDate != null) {
    //     List<Task> tasks = taskService.findByDateRange(startDate, endDate);
    //     if (tasks.isEmpty()) {
    //         return ResponseEntity.ok(new ArrayList<>());
    //     }
    //     return ResponseEntity.ok(tasks);
    // }
    // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
    
});

export default router;
