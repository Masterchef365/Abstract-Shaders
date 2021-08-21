Write a realtime AND offline rendering engine. You can do render to PNG (offline), screen, or both with live updates (like Blender)
Will render any animation you want to specify via shaders and/or meshes - maybe this is actually part of micro_engine. Something like a save_frame. Then again we'd also really need a way to render in tiles or accumulator buffer or whatever. It would be nice to be able to at least create buffers, upload/download data to them, create images, upload/download buffers, schedule compute shaders, etc. etc. etc. 
We should just make our own goddamn render software already
I wanna use egui and WASM with this
